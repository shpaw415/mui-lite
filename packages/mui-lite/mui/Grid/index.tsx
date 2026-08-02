import {
	createElement,
	type CSSProperties,
	type ElementType,
	type ReactNode,
} from "react";
import {
	type MediaQueryType,
	useClassNames,
	useStyle,
} from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

type Breakpoint = keyof MediaQueryType;
type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export type GridProps = {
	children?: ReactNode;
	component?: ElementType;
	container?: boolean;
	/** Item size: number of columns (1–12), "grow", "auto", or true */
	size?: ResponsiveValue<number | "grow" | "auto" | boolean>;
	offset?: ResponsiveValue<number | "auto">;
	columns?: number;
	spacing?: number | string;
	rowSpacing?: number | string;
	columnSpacing?: number | string;
	direction?: CSSProperties["flexDirection"];
	wrap?: CSSProperties["flexWrap"];
} & MuiElementType<HTMLDivElement>;

function spacingToCss(v?: number | string): string | undefined {
	if (v === undefined) return undefined;
	if (typeof v === "number") return `${v * 8}px`;
	return v;
}

function sizeToFlex(size: number | "grow" | "auto" | boolean, columns: number) {
	if (size === true || size === "grow") {
		return { flexGrow: 1, flexBasis: 0, maxWidth: "100%" };
	}
	if (size === "auto" || size === false) {
		return { flexGrow: 0, flexBasis: "auto", maxWidth: "none", width: "auto" };
	}
	const pct = `${(Number(size) / columns) * 100}%`;
	return {
		flexGrow: 0,
		flexBasis: "auto",
		width: pct,
		maxWidth: pct,
	};
}

function resolveResponsive<T>(
	value: ResponsiveValue<T> | undefined,
): { base?: T; sm?: T; md?: T; lg?: T; xl?: T } {
	if (value === undefined) return {};
	if (typeof value !== "object" || value === null) {
		return { base: value as T };
	}
	const v = value as Partial<Record<Breakpoint, T>>;
	return {
		base: v.xs ?? v.sm ?? v.md,
		sm: v.sm,
		md: v.md,
		lg: v.lg,
		xl: v.xl,
	};
}

export default function Grid({
	children,
	component = "div",
	container = false,
	size,
	offset,
	columns = 12,
	spacing = 0,
	rowSpacing,
	columnSpacing,
	direction = "row",
	wrap = "wrap",
	className,
	sx,
	style,
	...props
}: GridProps) {
	const sxStyle = useStyle(sx);
	const root = useClassNames({
		component_name: "Grid",
		className: [className, sxStyle.classNameFromSx],
		state: [container && "container", !container && "item"],
	});

	const gap = spacingToCss(spacing);
	const rowGap = spacingToCss(rowSpacing) ?? gap;
	const colGap = spacingToCss(columnSpacing) ?? gap;

	const sizeR = resolveResponsive(size);
	const offsetR = resolveResponsive(offset);

	const itemStyle: CSSProperties = {};
	if (!container && sizeR.base !== undefined) {
		Object.assign(itemStyle, sizeToFlex(sizeR.base as any, columns));
	}
	if (!container && offsetR.base !== undefined && offsetR.base !== "auto") {
		itemStyle.marginLeft = `${(Number(offsetR.base) / columns) * 100}%`;
	} else if (!container && offsetR.base === "auto") {
		itemStyle.marginLeft = "auto";
	}

	const cssVars: Record<string, string | undefined> = {
		"--Grid-columns": String(columns),
	};
	if (sizeR.sm !== undefined)
		cssVars["--Grid-size-sm"] =
			typeof sizeR.sm === "number"
				? `${(sizeR.sm / columns) * 100}%`
				: sizeR.sm === "grow" || sizeR.sm === true
					? "grow"
					: "auto";
	if (sizeR.md !== undefined)
		cssVars["--Grid-size-md"] =
			typeof sizeR.md === "number"
				? `${(sizeR.md / columns) * 100}%`
				: sizeR.md === "grow" || sizeR.md === true
					? "grow"
					: "auto";
	if (sizeR.lg !== undefined)
		cssVars["--Grid-size-lg"] =
			typeof sizeR.lg === "number"
				? `${(sizeR.lg / columns) * 100}%`
				: sizeR.lg === "grow" || sizeR.lg === true
					? "grow"
					: "auto";
	if (sizeR.xl !== undefined)
		cssVars["--Grid-size-xl"] =
			typeof sizeR.xl === "number"
				? `${(sizeR.xl / columns) * 100}%`
				: sizeR.xl === "grow" || sizeR.xl === true
					? "grow"
					: "auto";

	const containerStyle: CSSProperties = container
		? {
				display: "flex",
				flexDirection: direction,
				flexWrap: wrap,
				gap: rowGap && colGap ? undefined : gap,
				rowGap,
				columnGap: colGap,
			}
		: itemStyle;

	return createElement(
		component,
		{
			...props,
			className: root.combined,
			style: {
				...cssVars,
				...containerStyle,
				...sxStyle.styleFromSx,
				...style,
			},
		},
		children,
	);
}
