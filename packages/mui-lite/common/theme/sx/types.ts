import type { CSSProperties } from "react";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export type BreakpointValues = Record<Breakpoint, number>;

export const DEFAULT_BREAKPOINTS: BreakpointValues = {
	xs: 0,
	sm: 600,
	md: 900,
	lg: 1200,
	xl: 1536,
};

export const BREAKPOINT_KEYS: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"];

/** Legacy mui-lite color token object */
export type SxColorTheme = Partial<
	Record<string, "light" | "dark" | "main" | "theme">
>;

export type ResponsiveStyleValue<T> =
	| T
	| Partial<Record<Breakpoint, T | null | undefined>>
	| Array<T | null | undefined>;

export type SystemPropValue = ResponsiveStyleValue<
	string | number | SxColorTheme | null | undefined
>;

/** Flat CSS-like props plus system shorthands and nested selectors */
export type SxObject = {
	[K in keyof CSSProperties]?:
		| CSSProperties[K]
		| ResponsiveStyleValue<CSSProperties[K]>
		| SxColorTheme;
} & {
	// spacing
	m?: SystemPropValue;
	mt?: SystemPropValue;
	mr?: SystemPropValue;
	mb?: SystemPropValue;
	ml?: SystemPropValue;
	mx?: SystemPropValue;
	my?: SystemPropValue;
	p?: SystemPropValue;
	pt?: SystemPropValue;
	pr?: SystemPropValue;
	pb?: SystemPropValue;
	pl?: SystemPropValue;
	px?: SystemPropValue;
	py?: SystemPropValue;
	// layout aliases
	bgcolor?: SystemPropValue;
	typography?: SystemPropValue;
	// breakpoints as nested style bags (legacy + MUI)
	xs?: SxObject;
	sm?: SxObject;
	md?: SxObject;
	lg?: SxObject;
	xl?: SxObject;
	// nested selectors / media / pseudos
	[key: string]: unknown;
};

export type SxFunction<Theme = unknown> = (theme: Theme) => SxInput<Theme>;

export type SxInput<Theme = unknown> =
	| SxObject
	| SxFunction<Theme>
	| Array<boolean | SxObject | SxFunction<Theme> | null | undefined>
	| false
	| null
	| undefined;

/** Public prop type used across components */
export type SxProps<Theme = unknown> = SxInput<Theme>;

export type ResolvedInline = Partial<CSSProperties>;

export type SxResolveResult = {
	/** Properties safe for React style={} */
	style: ResolvedInline;
	/** Injected class for media queries / pseudos / nested rules */
	className?: string;
	/** Raw CSS text that was injected (for tests/SSR) */
	cssText?: string;
};

export type ThemeLike = {
	theme: "light" | "dark";
	locale?: string;
	spacing?: number | ((factor: number) => string | number);
	breakpoints?: BreakpointValues;
	[key: string]: unknown;
};
