"use client";

import {
	type CSSProperties,
	type ChangeEvent,
	type InputHTMLAttributes,
	type ReactElement,
	type RefObject,
	type TextareaHTMLAttributes,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from "react";
import { type SxProps, useClassNames, useStyle } from "../../common/theme";

export type MultilineConfig = {
	minRows?: number;
	maxRows?: number;
	/** Fixed rows — disables auto-grow */
	rows?: number;
};

export type InputBaseProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"size" | "style"
> & {
	variant?: "outlined" | "filled" | "standard";
	startIcon?: any;
	endIcon?: any;
	label?: string;
	color?: "error" | "success" | "secondary";
	helpText?: string;
	multiline?: boolean | MultilineConfig;
	children?: ReactElement<HTMLSelectElement>;
	resetValue?: boolean;
	sx?: SxProps;
	style?: CSSProperties;
	ref?: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
};

const LINE_HEIGHT_EM = 1.4375;

const useIsoLayoutEffect =
	typeof document !== "undefined" ? useLayoutEffect : useEffect;

function resolveMultiline(multiline: boolean | MultilineConfig | undefined) {
	if (!multiline) {
		return { enabled: false as const };
	}
	if (multiline === true) {
		return {
			enabled: true as const,
			minRows: 2,
			maxRows: undefined as number | undefined,
			fixedRows: undefined as number | undefined,
		};
	}
	// fixed `rows` → no auto-grow
	if (multiline.rows != null && multiline.minRows == null && multiline.maxRows == null) {
		return {
			enabled: true as const,
			minRows: multiline.rows,
			maxRows: multiline.rows,
			fixedRows: multiline.rows,
		};
	}
	const minRows = multiline.minRows ?? multiline.rows ?? 2;
	const maxRows = multiline.maxRows;
	return {
		enabled: true as const,
		minRows,
		maxRows,
		fixedRows: undefined as number | undefined,
	};
}

function syncTextareaHeight(
	el: HTMLTextAreaElement,
	minRows: number,
	maxRows?: number,
) {
	const cs = getComputedStyle(el);
	// Prefer measured line-height; fall back to em * font-size
	let linePx = parseFloat(cs.lineHeight);
	if (!Number.isFinite(linePx) || linePx <= 0) {
		const fontPx = parseFloat(cs.fontSize) || 16;
		linePx = fontPx * LINE_HEIGHT_EM;
	}
	const padY =
		(parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
	const borderY =
		(parseFloat(cs.borderTopWidth) || 0) +
		(parseFloat(cs.borderBottomWidth) || 0);

	const minH = minRows * linePx + padY + borderY;
	const maxH =
		typeof maxRows === "number"
			? maxRows * linePx + padY + borderY
			: Number.POSITIVE_INFINITY;

	// collapse then expand to content
	el.style.height = "0px";
	el.style.overflowY = "hidden";
	const contentH = el.scrollHeight;
	const next = Math.min(Math.max(contentH, minH), maxH);
	el.style.height = `${next}px`;
	el.style.overflowY = contentH > maxH ? "auto" : "hidden";
}

/**
 * Bare input primitive for custom field surfaces.
 *
 * @example Search box core
 * ```tsx
 * <InputBase placeholder="Search…" fullWidth />
 * ```
 */
export default function InputBase({
	id,
	multiline,
	variant,
	className,
	sx,
	style,
	ref: refProp,
	onChange,
	value,
	defaultValue,
	...props
}: InputBaseProps) {
	const sxStyle = useStyle(sx);
	const config = useMemo(() => resolveMultiline(multiline), [multiline]);
	const isMultiline = config.enabled;
	const localRef = useRef<HTMLTextAreaElement | null>(null);

	const setRefs = useCallback(
		(node: HTMLTextAreaElement | null) => {
			localRef.current = node;
			if (!refProp) return;
			if (typeof refProp === "function") {
				(refProp as (n: HTMLTextAreaElement | null) => void)(node);
			} else {
				(refProp as RefObject<HTMLTextAreaElement | null>).current = node;
			}
		},
		[refProp],
	);

	const resize = useCallback(() => {
		const el = localRef.current;
		if (!el || !config.enabled || config.fixedRows != null) return;
		syncTextareaHeight(el, config.minRows, config.maxRows);
	}, [config]);

	useIsoLayoutEffect(() => {
		resize();
	}, [resize, value, defaultValue]);

	// remeasure after fonts / layout
	useEffect(() => {
		if (!isMultiline || config.fixedRows != null) return;
		const el = localRef.current;
		if (!el || typeof ResizeObserver === "undefined") return;
		const ro = new ResizeObserver(() => resize());
		ro.observe(el);
		return () => ro.disconnect();
	}, [isMultiline, config.fixedRows, resize]);

	const classes_input = useClassNames({
		component_name: "TextField_Input",
		variant: variant,
		state: [isMultiline && "multiline"],
		className,
	});

	const classes_textArea = useClassNames({
		component_name: "TextField_TextArea",
		variant: variant,
		state: [
			isMultiline && "multiline",
			isMultiline && config.fixedRows == null && "autogrow",
		],
		className,
	});

	if (isMultiline) {
		const { type: _type, ...rest } = props as InputHTMLAttributes<HTMLInputElement> &
			TextareaHTMLAttributes<HTMLTextAreaElement>;

		const minHeight = `${config.minRows * LINE_HEIGHT_EM}em`;
		const maxHeight =
			typeof config.maxRows === "number"
				? `${config.maxRows * LINE_HEIGHT_EM}em`
				: undefined;

		const handleChange = (
			e: ChangeEvent<HTMLTextAreaElement>,
		) => {
			onChange?.(e as unknown as ChangeEvent<HTMLInputElement>);
			// grow after value commits
			requestAnimationFrame(() => resize());
		};

		return (
			<textarea
				id={id}
				ref={setRefs}
				className={[classes_textArea.combined, sxStyle.classNameFromSx]
					.filter(Boolean)
					.join(" ")}
				placeholder=" "
				rows={config.fixedRows ?? config.minRows}
				value={value as string | undefined}
				defaultValue={defaultValue as string | undefined}
				onChange={handleChange}
				style={{
					minHeight,
					...(maxHeight ? { maxHeight } : null),
					boxSizing: "border-box",
					...sxStyle.styleFromSx,
					...style,
				}}
				{...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
			/>
		);
	}

	return (
		<input
			id={id}
			ref={refProp as RefObject<HTMLInputElement | null> | undefined}
			className={[classes_input.combined, sxStyle.classNameFromSx]
				.filter(Boolean)
				.join(" ")}
			placeholder=" "
			style={{ ...sxStyle.styleFromSx, ...style }}
			value={value}
			defaultValue={defaultValue}
			onChange={onChange}
			{...(props as InputHTMLAttributes<HTMLInputElement>)}
		/>
	);
}
