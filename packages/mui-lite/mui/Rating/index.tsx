"use client";

import clsx from "clsx";
import {
	type ReactNode,
	useCallback,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import {
	type MuiElementColors,
	type MuiElementType,
	useColorOverRide,
} from "../../common/utils";

function StarIcon({ filled }: { filled?: boolean }) {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			aria-hidden
			focusable="false"
		>
			{filled ? (
				<path
					d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
					fill="currentColor"
				/>
			) : (
				<path
					d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
					fill="currentColor"
				/>
			)}
		</svg>
	);
}

function roundToPrecision(val: number, precision: number) {
	const nearest = Math.round(val / precision) * precision;
	// avoid 1.0000000002 style floats
	const exp = precision.toString().split(".")[1]?.length ?? 0;
	return Number(nearest.toFixed(exp + 1));
}

export type RatingProps = {
	name?: string;
	value?: number | null;
	defaultValue?: number | null;
	max?: number;
	/**
	 * Step between values. Use `0.5` for half-stars (default), `1` for whole stars.
	 */
	precision?: number;
	readOnly?: boolean;
	disabled?: boolean;
	/** Filled icon (uses `currentColor` — prefer SVG with `fill="currentColor"`). */
	icon?: ReactNode;
	/** Empty / outline icon. */
	emptyIcon?: ReactNode;
	/**
	 * Palette color for filled icons and hover glow.
	 * Defaults to the classic gold rating accent when omitted.
	 */
	color?: MuiElementColors;
	/** Arbitrary CSS color for filled icons (wins over `color`). */
	colorOverRide?: React.CSSProperties["color"];
	size?: "small" | "medium" | "large";
	highlightSelectedOnly?: boolean;
	getLabelText?: (value: number) => string;
	emptyLabelText?: string;
	onChange?: (event: React.SyntheticEvent, value: number | null) => void;
	onChangeActive?: (event: React.SyntheticEvent, value: number) => void;
} & Omit<MuiElementType<HTMLSpanElement>, "onChange" | "defaultValue" | "color">;

/**
 * Star score input and display for reviews.
 *
 * @example Product review (half-star steps)
 * ```tsx
 * <Rating name="quality" defaultValue={3.5} precision={0.5} onChange={setScore} />
 * ```
 *
 * @example Custom icon + color
 * ```tsx
 * <Rating
 *   name="love"
 *   defaultValue={4}
 *   color="error"
 *   icon={<HeartFilled />}
 *   emptyIcon={<HeartOutline />}
 * />
 * ```
 */
export default function Rating({
	name: nameProp,
	value: valueProp,
	defaultValue = null,
	max = 5,
	precision: precisionProp = 0.5,
	readOnly = false,
	disabled = false,
	icon,
	emptyIcon,
	color,
	colorOverRide,
	size = "medium",
	highlightSelectedOnly = false,
	getLabelText = (v) => `${v} Star${v !== 1 ? "s" : ""}`,
	emptyLabelText = "Empty",
	onChange,
	onChangeActive,
	className,
	sx,
	...props
}: RatingProps) {
	const precision =
		precisionProp > 0 && precisionProp <= 1 ? precisionProp : 1;
	const id = useId();
	const name = nameProp ?? id;
	const isControlled = valueProp !== undefined;
	const [internal, setInternal] = useState<number | null>(
		defaultValue == null ? null : roundToPrecision(defaultValue, precision),
	);
	const value = isControlled
		? valueProp == null
			? null
			: roundToPrecision(valueProp, precision)
		: internal;

	/** -1 = no hover/focus preview */
	const [hover, setHover] = useState(-1);
	const [focus, setFocus] = useState(-1);
	const rootRef = useRef<HTMLSpanElement>(null);

	const interactive = !readOnly && !disabled;

	/** Value shown in the UI: hover/focus preview takes priority over committed value */
	const displayValue =
		hover !== -1 ? hover : focus !== -1 ? focus : (value ?? 0);

	/** Whether we are showing a live preview (not the committed rating alone) */
	const isPreviewing = interactive && (hover !== -1 || focus !== -1);

	const root = useClassNames({
		component_name: "Rating",
		className,
		state: [
			size,
			color,
			readOnly && "readOnly",
			disabled && "disabled",
			isPreviewing && "previewing",
			focus !== -1 && "focusVisible",
		],
	});
	const style = useStyle(sx);
	const overRideColor = useColorOverRide({ colorOverRide });

	const handleChange = useCallback(
		(event: React.SyntheticEvent, newValue: number) => {
			if (!interactive) return;
			// Clicking the same whole-star value again clears (MUI behavior at precision 1)
			const next =
				value === newValue && precision === 1 ? null : newValue;
			if (!isControlled) setInternal(next);
			onChange?.(event, next);
		},
		[interactive, value, precision, isControlled, onChange],
	);

	const setPreview = useCallback(
		(event: React.SyntheticEvent, itemValue: number) => {
			if (!interactive) return;
			setHover(itemValue);
			onChangeActive?.(event, itemValue);
		},
		[interactive, onChangeActive],
	);

	const clearPreview = useCallback(
		(event?: React.SyntheticEvent) => {
			setHover(-1);
			onChangeActive?.((event ?? ({} as React.SyntheticEvent)), -1);
		},
		[onChangeActive],
	);

	/**
	 * Mouse move over the root: compute value from X position so half-stars
	 * track the cursor within each icon (not only discrete label hit areas).
	 */
	const handleMouseMove = useCallback(
		(event: React.MouseEvent<HTMLSpanElement>) => {
			if (!interactive) return;
			const rootEl = rootRef.current;
			if (!rootEl) return;
			const { left, width } = rootEl.getBoundingClientRect();
			if (width <= 0) return;
			const percent = Math.min(
				1,
				Math.max(0, (event.clientX - left) / width),
			);
			const raw = percent * max;
			// Empty (left edge) → 0 preview only if very close to start; else at least precision
			const next =
				raw < precision / 2
					? precision // first half still maps to first step when past edge
					: roundToPrecision(Math.min(max, Math.max(precision, raw)), precision);
			// Prefer pure edge: if still in first few px, allow 0? MUI uses labels.
			// Keep min precision so something always highlights under cursor.
			if (hover !== next) {
				setHover(next);
				onChangeActive?.(event, next);
			}
		},
		[interactive, max, precision, hover, onChangeActive],
	);

	const decimalsPerIcon = Math.round(1 / precision);

	const items = useMemo(() => {
		const nodes: ReactNode[] = [];

		for (let star = 1; star <= max; star++) {
			const segments: ReactNode[] = [];

			for (let d = 1; d <= decimalsPerIcon; d++) {
				const itemValue = roundToPrecision(
					star - 1 + d * precision,
					precision,
				);
				const isActive = highlightSelectedOnly
					? displayValue === itemValue
					: displayValue >= itemValue - 1e-9;

				// Committed fill (actual value) vs preview fill
				const isCommitted = (value ?? 0) >= itemValue - 1e-9;
				const isPreviewFill = isPreviewing && isActive;
				const isEmpty = !isActive;

				const widthPct = 100 / decimalsPerIcon;
				const leftPct = (d - 1) * widthPct;

				segments.push(
					<label
						key={itemValue}
						className={clsx(
							"MUI_Rating_label",
							decimalsPerIcon > 1 && "MUI_Rating_label_decimal",
						)}
						style={
							decimalsPerIcon > 1
								? {
										width: `${widthPct}%`,
										left: `${leftPct}%`,
									}
								: undefined
						}
					>
						<input
							type="radio"
							className="MUI_Rating_visuallyHidden"
							name={name}
							value={itemValue}
							checked={value === itemValue}
							disabled={disabled || readOnly}
							readOnly={readOnly}
							onChange={(e) => handleChange(e, itemValue)}
							onClick={(e) => {
								// allow re-click same value (toggle off only at precision 1)
								if (value === itemValue) {
									handleChange(e, itemValue);
								}
							}}
							onFocus={() => setFocus(itemValue)}
							onBlur={() => setFocus(-1)}
						/>
						<span
							className={clsx(
								"MUI_Rating_icon",
								isEmpty
									? "MUI_Rating_icon_empty"
									: "MUI_Rating_icon_filled",
								isActive && "MUI_Rating_icon_active",
								isPreviewFill && "MUI_Rating_icon_preview",
								isCommitted &&
									!isPreviewing &&
									"MUI_Rating_icon_committed",
							)}
							style={
								decimalsPerIcon > 1
									? {
											// Pull icon so the correct half shows in the clip
											width: `${100 * decimalsPerIcon}%`,
											marginLeft: `-${(d - 1) * 100}%`,
										}
									: undefined
							}
						>
							{isEmpty
								? (emptyIcon ?? <StarIcon />)
								: (icon ?? <StarIcon filled />)}
						</span>
						<span className="MUI_Rating_visuallyHidden">
							{getLabelText(itemValue)}
						</span>
					</label>,
				);
			}

			nodes.push(
				<span key={star} className="MUI_Rating_decimal">
					{/* Empty icon underlay so half-stars show outline on the empty half */}
					{decimalsPerIcon > 1 && (
						<span className="MUI_Rating_icon MUI_Rating_icon_empty MUI_Rating_icon_underlay" aria-hidden>
							{emptyIcon ?? <StarIcon />}
						</span>
					)}
					{segments}
				</span>,
			);
		}

		return nodes;
	}, [
		max,
		decimalsPerIcon,
		precision,
		displayValue,
		value,
		isPreviewing,
		highlightSelectedOnly,
		name,
		disabled,
		readOnly,
		icon,
		emptyIcon,
		getLabelText,
		handleChange,
	]);

	return (
		<span
			ref={rootRef}
			role={readOnly ? "img" : "radiogroup"}
			aria-label={
				readOnly
					? value
						? getLabelText(value)
						: emptyLabelText
					: props["aria-label"]
			}
			className={clsx(root.combined, style.classNameFromSx)}
			style={{
				...style.styleFromSx,
				...overRideColor,
			}}
			onMouseMove={interactive ? handleMouseMove : undefined}
			onMouseLeave={(e) => {
				clearPreview(e);
				setFocus(-1);
			}}
			{...props}
		>
			{items}
		</span>
	);
}
