"use client";

import clsx from "clsx";
import {
	type CSSProperties,
	type KeyboardEvent,
	type PointerEvent as ReactPointerEvent,
	type RefObject,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { type SxProps, useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import ToolTip from "../ToolTip";

function toArray(v: number | number[] | undefined): number[] | undefined {
	if (v === undefined) return undefined;
	return Array.isArray(v) ? v : [v];
}

function clamp(n: number, lo: number, hi: number) {
	return Math.min(hi, Math.max(lo, n));
}

function snap(n: number, min: number, max: number, step: number) {
	if (!Number.isFinite(step) || step <= 0) return clamp(n, min, max);
	const stepped = Math.round((n - min) / step) * step + min;
	// Avoid float noise (e.g. 0.1 + 0.2)
	const precision = Math.max(
		0,
		(String(step).split(".")[1]?.length ?? 0) + 2,
	);
	const rounded =
		Math.round(stepped * 10 ** precision) / 10 ** precision;
	return clamp(rounded, min, max);
}

function valueToPercent(value: number, min: number, max: number) {
	if (max === min) return 0;
	return ((value - min) * 100) / (max - min);
}

function percentToValue(percent: number, min: number, max: number) {
	return min + ((max - min) * percent) / 100;
}

export type SliderProps = {
	disabled?: boolean;
	readOnly?: boolean;
	min?: number;
	max?: number;
	step?: number;
	/** Called with one value, or two for a range slider */
	onChange?: (values: number[]) => void;
	value?: number | number[];
	defaultValue?: number | number[];
	name?: string;
	id?: string;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	valueLabelDisplay?: "on" | "auto" | "off";
	valueLabelFormat?: (value: number) => string | number;
	/** Enable value tooltip labels on thumbs */
	toolTip?: boolean;
	sx?: SxProps;
	ref?: RefObject<HTMLSpanElement | null>;
	className?: string;
	style?: CSSProperties;
} & Omit<
	MuiElementType<HTMLSpanElement>,
	"onChange" | "defaultValue" | "value" | "ref" | "children"
>;

/**
 * Continuous or discrete numeric control (single value or range).
 *
 * @example Volume with always-visible value tooltip
 * ```tsx
 * <Slider
 *   min={0}
 *   max={100}
 *   defaultValue={40}
 *   toolTip
 *   valueLabelDisplay="on"
 *   aria-label="Volume"
 * />
 * ```
 *
 * @example Price range filter
 * ```tsx
 * <Slider
 *   defaultValue={[25, 75]}
 *   toolTip
 *   valueLabelDisplay="auto"
 *   valueLabelFormat={(v) => `$${v}`}
 *   onChange={setPriceRange}
 * />
 * ```
 */
function Slider({
	className,
	disabled = false,
	readOnly = false,
	min = 0,
	max = 100,
	step = 1,
	onChange,
	sx,
	value: valueProp,
	defaultValue,
	name,
	id: idProp,
	valueLabelDisplay: valueLabelDisplayProp = "off",
	valueLabelFormat,
	toolTip = false,
	style,
	ref,
	...props
}: SliderProps) {
	// toolTip alone implies auto labels (show while active, hide after idle/drag end)
	const valueLabelDisplay =
		toolTip && valueLabelDisplayProp === "off"
			? "auto"
			: valueLabelDisplayProp;

	const isControlled = valueProp !== undefined;
	const initial = useMemo(() => {
		const raw =
			toArray(valueProp) ??
			toArray(defaultValue) ??
			[min];
		return raw.map((v) => snap(v, min, max, step));
	}, []); // mount only

	const [inner, setInner] = useState<number[]>(initial);
	const values = (isControlled ? toArray(valueProp)! : inner).map((v) =>
		snap(v, min, max, step),
	);
	// Range thumbs must stay ordered for track math
	const ordered =
		values.length > 1 ? [...values].sort((a, b) => a - b) : values;

	const rootRef = useRef<HTMLSpanElement | null>(null);
	const valuesRef = useRef(ordered);
	valuesRef.current = ordered;

	const setRootRef = useCallback(
		(node: HTMLSpanElement | null) => {
			rootRef.current = node;
			if (typeof ref === "function")
				(ref as (n: HTMLSpanElement | null) => void)(node);
			else if (ref)
				(ref as RefObject<HTMLSpanElement | null>).current = node;
		},
		[ref],
	);

	const activeIndex = useRef<number | null>(null);
	const [dragging, setDragging] = useState(false);
	const [activeThumb, setActiveThumb] = useState<number | null>(null);
	/** Controlled value-label open state (auto mode); "on" is always open */
	const [labelVisible, setLabelVisible] = useState(false);
	const hideLabelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const LABEL_HIDE_DELAY_MS = 750;
	const uid = useId();

	const clearHideLabelTimer = useCallback(() => {
		if (hideLabelTimer.current != null) {
			clearTimeout(hideLabelTimer.current);
			hideLabelTimer.current = null;
		}
	}, []);

	const showValueLabel = useCallback(
		(thumbIndex: number) => {
			clearHideLabelTimer();
			setActiveThumb(thumbIndex);
			setLabelVisible(true);
		},
		[clearHideLabelTimer],
	);

	/** Hide after drag stop / keyboard idle (auto mode) */
	const scheduleHideValueLabel = useCallback(
		(delay = LABEL_HIDE_DELAY_MS) => {
			clearHideLabelTimer();
			hideLabelTimer.current = setTimeout(() => {
				setLabelVisible(false);
				setActiveThumb(null);
				hideLabelTimer.current = null;
			}, delay);
		},
		[clearHideLabelTimer],
	);

	useEffect(() => () => clearHideLabelTimer(), [clearHideLabelTimer]);

	const commit = useCallback(
		(next: number[]) => {
			const snapped = next.map((v) => snap(v, min, max, step));
			// Keep range thumbs from crossing: clamp active against the other
			if (snapped.length === 2 && activeIndex.current != null) {
				const i = activeIndex.current;
				const other = snapped[1 - i];
				if (i === 0 && snapped[0] > other) snapped[0] = other;
				if (i === 1 && snapped[1] < other) snapped[1] = other;
			}
			valuesRef.current = snapped;
			if (!isControlled) setInner(snapped);
			onChange?.(snapped);
		},
		[isControlled, min, max, step, onChange],
	);

	const valueFromClientX = useCallback(
		(clientX: number) => {
			const el = rootRef.current;
			if (!el) return min;
			const rect = el.getBoundingClientRect();
			// Rail spans the root's client width; map X → value directly (1:1 with pointer)
			const width = rect.width || 1;
			const ratio = clamp((clientX - rect.left) / width, 0, 1);
			return snap(percentToValue(ratio * 100, min, max), min, max, step);
		},
		[min, max, step],
	);

	const nearestThumbIndex = useCallback(
		(clientX: number) => {
			const target = valueFromClientX(clientX);
			const current = valuesRef.current;
			if (current.length === 1) return 0;
			let best = 0;
			let bestDist = Math.abs(current[0] - target);
			for (let i = 1; i < current.length; i++) {
				const d = Math.abs(current[i] - target);
				if (d < bestDist) {
					best = i;
					bestDist = d;
				}
			}
			return best;
		},
		[valueFromClientX],
	);

	const applyPointer = useCallback(
		(clientX: number, thumbIndex: number) => {
			const nextVal = valueFromClientX(clientX);
			const next = [...valuesRef.current];
			next[thumbIndex] = nextVal;
			if (next.length === 2) {
				if (thumbIndex === 0 && next[0] > next[1]) next[0] = next[1];
				if (thumbIndex === 1 && next[1] < next[0]) next[1] = next[0];
			}
			activeIndex.current = thumbIndex;
			commit(next);
		},
		[valueFromClientX, commit],
	);

	const onRootPointerDown = (e: ReactPointerEvent<HTMLSpanElement>) => {
		if (disabled || readOnly) return;
		// Ignore non-primary buttons
		if (e.button !== 0 && e.pointerType === "mouse") return;
		e.preventDefault();
		const idx = nearestThumbIndex(e.clientX);
		activeIndex.current = idx;
		setDragging(true);
		showValueLabel(idx);
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
		applyPointer(e.clientX, idx);
	};

	const onRootPointerMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
		if (disabled || readOnly || activeIndex.current == null) return;
		if (!e.currentTarget.hasPointerCapture?.(e.pointerId) && !dragging)
			return;
		e.preventDefault();
		// Keep label up while dragging; reset any pending hide
		showValueLabel(activeIndex.current);
		applyPointer(e.clientX, activeIndex.current);
	};

	const endDrag = (e: ReactPointerEvent<HTMLSpanElement>) => {
		if (activeIndex.current == null) return;
		try {
			e.currentTarget.releasePointerCapture?.(e.pointerId);
		} catch {
			/* already released */
		}
		const thumb = activeIndex.current;
		activeIndex.current = null;
		setDragging(false);
		// Keep label briefly after release, then hide (auto / toolTip)
		if (valueLabelDisplay === "auto" || toolTip) {
			setActiveThumb(thumb);
			setLabelVisible(true);
			scheduleHideValueLabel();
		} else {
			setActiveThumb(null);
			setLabelVisible(false);
		}
	};

	// Sync controlled value into drag state when not dragging
	useEffect(() => {
		if (!isControlled || dragging) return;
		const next = toArray(valueProp)?.map((v) => snap(v, min, max, step));
		if (next) setInner(next);
	}, [valueProp, isControlled, dragging, min, max, step]);

	const onThumbKeyDown = (index: number) => (e: KeyboardEvent) => {
		if (disabled || readOnly) return;
		const delta =
			e.key === "ArrowRight" || e.key === "ArrowUp"
				? step
				: e.key === "ArrowLeft" || e.key === "ArrowDown"
					? -step
					: e.key === "PageUp"
						? step * 10
						: e.key === "PageDown"
							? -step * 10
							: e.key === "Home"
								? min - ordered[index]
								: e.key === "End"
									? max - ordered[index]
									: 0;
		if (delta === 0 && e.key !== "Home" && e.key !== "End") return;
		e.preventDefault();
		activeIndex.current = index;
		showValueLabel(index);
		const next = [...ordered];
		next[index] = snap(ordered[index] + delta, min, max, step);
		if (next.length === 2) {
			if (index === 0 && next[0] > next[1]) next[0] = next[1];
			if (index === 1 && next[1] < next[0]) next[1] = next[0];
		}
		commit(next);
		activeIndex.current = null;
		// Hide after keyboard inactivity
		if (valueLabelDisplay === "auto" || toolTip) {
			scheduleHideValueLabel();
		}
	};

	const trackStyle: CSSProperties =
		ordered.length > 1
			? {
					left: `${valueToPercent(ordered[0], min, max)}%`,
					width: `${valueToPercent(ordered[1], min, max) - valueToPercent(ordered[0], min, max)}%`,
				}
			: {
					left: 0,
					width: `${valueToPercent(ordered[0] ?? min, min, max)}%`,
				};

	const root = useClassNames({
		component_name: "Slider_Root",
		className,
		state: [
			disabled && "disabled",
			dragging && "dragging",
			ordered.length > 1 && "range",
		],
	});
	const styleSx = useStyle(sx);

	const showLabel =
		toolTip || valueLabelDisplay === "on" || valueLabelDisplay === "auto";

	const formatLabel = (v: number) =>
		valueLabelFormat ? String(valueLabelFormat(v)) : String(v);

	return (
		<span
			{...props}
			id={idProp}
			ref={setRootRef}
			className={clsx(root.combined, styleSx.classNameFromSx)}
			style={{ ...styleSx.styleFromSx, ...style }}
			onPointerDown={onRootPointerDown}
			onPointerMove={onRootPointerMove}
			onPointerUp={endDrag}
			onPointerCancel={endDrag}
			role="group"
			aria-disabled={disabled || undefined}
		>
			<span className="MUI_Slider_Rail" />
			<span className="MUI_Slider_Track" style={trackStyle} />

			{ordered.map((val, index) => {
				const pct = valueToPercent(val, min, max);
				const face = <span className="MUI_Slider_ThumbFace" aria-hidden />;
				// "on" = always; "auto"/toolTip = while dragging or until hide timer fires
				const labelOpen =
					valueLabelDisplay === "on" ||
					(valueLabelDisplay === "auto" &&
						labelVisible &&
						activeThumb === index);

				return (
					<span
						key={index}
						className={clsx(
							"MUI_Slider_Thumb",
							dragging && activeThumb === index && "MUI_Slider_Thumb_active",
						)}
						style={{ left: `${pct}%` }}
						tabIndex={disabled ? -1 : 0}
						role="slider"
						aria-valuemin={min}
						aria-valuemax={max}
						aria-valuenow={val}
						aria-label={
							props["aria-label"] ??
							(ordered.length > 1 ? `Value ${index + 1}` : "Value")
						}
						aria-labelledby={props["aria-labelledby"]}
						aria-disabled={disabled || undefined}
						aria-readonly={readOnly || undefined}
						onKeyDown={onThumbKeyDown(index)}
						onPointerDown={(e) => {
							if (disabled || readOnly) return;
							e.stopPropagation();
							e.preventDefault();
							activeIndex.current = index;
							setDragging(true);
							showValueLabel(index);
							rootRef.current?.setPointerCapture?.(e.pointerId);
							applyPointer(e.clientX, index);
						}}
					>
						{/* ToolTip inside the absolute thumb so left/% stays on the rail */}
						{showLabel ? (
							<ToolTip
								title={formatLabel(val)}
								placement="top"
								// Controlled boolean — never leave `undefined` after open
								// (ToolTip only reacts when `open` is defined).
								open={labelOpen}
								// Auto mode is fully controlled; "on" still allows hover polish
								triggers={valueLabelDisplay === "on" ? ["hover"] : []}
								SlotProps={{
									container: {
										className: "MUI_Slider_ThumbTip",
									},
								}}
							>
								{face}
							</ToolTip>
						) : (
							face
						)}
						<input
							type="range"
							className="MUI_Slider_Input"
							tabIndex={-1}
							aria-hidden
							readOnly={readOnly}
							disabled={disabled}
							min={min}
							max={max}
							step={step}
							name={
								name
									? ordered.length > 1
										? `${name}[${index}]`
										: name
									: undefined
							}
							value={val}
							onChange={() => {
								/* driven by pointer/keyboard */
							}}
							id={index === 0 ? `${uid}-input` : undefined}
						/>
					</span>
				);
			})}
		</span>
	);
}

export default Slider;
