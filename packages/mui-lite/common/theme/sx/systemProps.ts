import { COLOR_PROPS, resolveColorValue } from "./palette";
import { resolveSpacingValue, SPACING_PROPS } from "./spacing";
import type { ThemeLike } from "./types";

/** Aliases → CSS property */
const ALIASES: Record<string, string> = {
	bgcolor: "backgroundColor",
};

/**
 * Convert one key/value after responsive unwrap into CSS declarations.
 * Returns null if the key is a nested selector / breakpoint bag (caller handles).
 */
export function expandSystemProp(
	theme: ThemeLike,
	key: string,
	value: unknown,
): Record<string, string | number> | null {
	if (value == null || value === false) return null;

	// spacing shorthands
	if (key in SPACING_PROPS) {
		const resolved = resolveSpacingValue(theme, value);
		if (resolved == null) return null;
		const out: Record<string, string | number> = {};
		for (const cssKey of SPACING_PROPS[key]) {
			out[cssKey] = resolved;
		}
		return out;
	}

	const cssKey = ALIASES[key] ?? key;

	// typography shortcut: typography: "h1" — map to rough styles
	if (key === "typography" && typeof value === "string") {
		return typographyPreset(value);
	}

	// colors
	if (COLOR_PROPS.has(key) || COLOR_PROPS.has(cssKey)) {
		const color = resolveColorValue(theme, value);
		if (color == null) return null;
		return { [cssKey]: color };
	}

	// width/height fraction 0–1 → percent (MUI system convention)
	if (
		(cssKey === "width" ||
			cssKey === "height" ||
			cssKey === "maxWidth" ||
			cssKey === "maxHeight" ||
			cssKey === "minWidth" ||
			cssKey === "minHeight") &&
		typeof value === "number" &&
		value > 0 &&
		value <= 1
	) {
		return { [cssKey]: `${value * 100}%` };
	}

	// CSS spacing longhands: numbers use theme spacing scale
	if (
		typeof value === "number" &&
		/^(margin|padding)(Top|Right|Bottom|Left|Inline|Block|InlineStart|InlineEnd|BlockStart|BlockEnd)?$/.test(
			cssKey,
		)
	) {
		const resolved = resolveSpacingValue(theme, value);
		if (resolved != null) return { [cssKey]: resolved };
	}

	// borderRadius number → spacing units (MUI: theme.shape, we use 4px unit)
	if (cssKey === "borderRadius" && typeof value === "number") {
		return { borderRadius: `${value * 4}px` };
	}

	// plain CSS value
	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	) {
		return { [cssKey]: value as string | number };
	}

	// unresolved object color already handled; other objects → nested
	return null;
}

function typographyPreset(name: string): Record<string, string | number> {
	const map: Record<string, Record<string, string | number>> = {
		h1: { fontSize: "2.5rem", fontWeight: 300, lineHeight: 1.2, letterSpacing: "-0.01562em" },
		h2: { fontSize: "2rem", fontWeight: 300, lineHeight: 1.2, letterSpacing: "-0.00833em" },
		h3: { fontSize: "1.75rem", fontWeight: 400, lineHeight: 1.167, letterSpacing: "0em" },
		h4: { fontSize: "1.5rem", fontWeight: 400, lineHeight: 1.235, letterSpacing: "0.00735em" },
		h5: { fontSize: "1.25rem", fontWeight: 400, lineHeight: 1.334, letterSpacing: "0em" },
		h6: { fontSize: "1.125rem", fontWeight: 500, lineHeight: 1.6, letterSpacing: "0.0075em" },
		subtitle1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.75, letterSpacing: "0.00938em" },
		subtitle2: { fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.57, letterSpacing: "0.00714em" },
		body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.5, letterSpacing: "0.00938em" },
		body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.43, letterSpacing: "0.01071em" },
		button: {
			fontSize: "0.875rem",
			fontWeight: 500,
			lineHeight: 1.75,
			letterSpacing: "0.02857em",
			textTransform: "uppercase",
		},
		caption: { fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.66, letterSpacing: "0.03333em" },
		overline: {
			fontSize: "0.75rem",
			fontWeight: 400,
			lineHeight: 2.66,
			letterSpacing: "0.08333em",
			textTransform: "uppercase",
		},
	};
	return map[name] ?? { fontSize: "1rem" };
}
