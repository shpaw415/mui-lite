import type { ThemeLike } from "./types";

export function createSpacing(theme: ThemeLike) {
	const spacingOpt = theme.spacing;
	return (factor: number | string = 1): string => {
		if (typeof factor === "string") return factor;
		if (typeof spacingOpt === "function") {
			const v = spacingOpt(factor);
			return typeof v === "number" ? `${v}px` : String(v);
		}
		const base = typeof spacingOpt === "number" ? spacingOpt : 8;
		return `${base * factor}px`;
	};
}

/** Expand MUI spacing shorthands into CSS longhands */
export const SPACING_PROPS: Record<string, string[]> = {
	m: ["margin"],
	mt: ["marginTop"],
	mr: ["marginRight"],
	mb: ["marginBottom"],
	ml: ["marginLeft"],
	mx: ["marginLeft", "marginRight"],
	my: ["marginTop", "marginBottom"],
	p: ["padding"],
	pt: ["paddingTop"],
	pr: ["paddingRight"],
	pb: ["paddingBottom"],
	pl: ["paddingLeft"],
	px: ["paddingLeft", "paddingRight"],
	py: ["paddingTop", "paddingBottom"],
	gap: ["gap"],
	rowGap: ["rowGap"],
	columnGap: ["columnGap"],
};

export function resolveSpacingValue(
	theme: ThemeLike,
	value: unknown,
): string | number | undefined {
	if (value == null || value === "") return undefined;
	if (typeof value === "string") return value;
	if (typeof value === "number") {
		// integers (and halves) use spacing scale; large raw px still via number*scale
		return createSpacing(theme)(value);
	}
	return undefined;
}
