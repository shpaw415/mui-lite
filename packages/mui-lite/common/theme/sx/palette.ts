import type { ThemeLike } from "./types";

type Scheme = { light?: string; dark?: string; main?: string };

/**
 * Map MUI-style palette paths and mui-lite tokens → concrete CSS color.
 *
 * Supports:
 * - "primary.main" | "primary.light" | "primary.dark"
 * - "text.primary" | "text.secondary"
 * - "background.paper" | "background.default"
 * - "error.main" | "success.light" | ...
 * - "bg-primary.main" | "text-error.theme" (native tokens)
 * - legacy object { "bg-primary": "theme" }
 */
export function resolveColorValue(
	theme: ThemeLike,
	value: unknown,
): string | undefined {
	if (value == null) return undefined;
	if (typeof value === "string") {
		if (
			value.startsWith("#") ||
			value.startsWith("rgb") ||
			value.startsWith("hsl") ||
			value.startsWith("var(") ||
			value === "inherit" ||
			value === "currentColor" ||
			value === "transparent"
		) {
			return value;
		}
		return resolvePalettePath(theme, value);
	}
	if (typeof value === "object" && !Array.isArray(value)) {
		// legacy SxColorTheme: { "bg-primary": "theme" | "main" | ... }
		const obj = value as Record<string, string>;
		const keys = Object.keys(obj);
		if (keys.length === 0) return undefined;
		const token = keys[0];
		const shade = obj[token] ?? "theme";
		return readToken(theme, token, shade);
	}
	return undefined;
}

function readToken(
	theme: ThemeLike,
	token: string,
	shade: string,
): string | undefined {
	const scheme = theme[token] as Scheme | undefined;
	if (!scheme || typeof scheme !== "object") return undefined;
	const mode = theme.theme === "dark" ? "dark" : "light";
	if (shade === "theme") return scheme[mode] ?? scheme.main;
	if (shade === "light" || shade === "dark" || shade === "main") {
		return scheme[shade] ?? scheme.main;
	}
	return scheme.main;
}

const MUI_PATH_MAP: Record<string, { token: string; shade?: string }> = {
	"primary.main": { token: "bg-primary", shade: "main" },
	"primary.light": { token: "bg-primary", shade: "light" },
	"primary.dark": { token: "bg-primary", shade: "dark" },
	"secondary.main": { token: "bg-secondary", shade: "main" },
	"secondary.light": { token: "bg-secondary", shade: "light" },
	"secondary.dark": { token: "bg-secondary", shade: "dark" },
	"error.main": { token: "bg-error", shade: "main" },
	"error.light": { token: "bg-error", shade: "light" },
	"error.dark": { token: "bg-error", shade: "dark" },
	"warning.main": { token: "bg-warning", shade: "main" },
	"warning.light": { token: "bg-warning", shade: "light" },
	"warning.dark": { token: "bg-warning", shade: "dark" },
	"success.main": { token: "bg-success", shade: "main" },
	"success.light": { token: "bg-success", shade: "light" },
	"success.dark": { token: "bg-success", shade: "dark" },
	"info.main": { token: "text-info", shade: "main" },
	"info.light": { token: "text-info", shade: "light" },
	"info.dark": { token: "text-info", shade: "dark" },
	"text.primary": { token: "text-main", shade: "theme" },
	"text.secondary": { token: "text-secondary", shade: "theme" },
	"text.disabled": { token: "text-main", shade: "main" },
	"background.paper": { token: "bg-surface", shade: "theme" },
	"background.default": { token: "bg-main", shade: "theme" },
	"common.white": { token: "", shade: "#fff" },
	"common.black": { token: "", shade: "#000" },
	// text-colored aliases
	"primary.contrastText": { token: "", shade: "#fff" },
	"secondary.contrastText": { token: "", shade: "#fff" },
};

function resolvePalettePath(theme: ThemeLike, path: string): string | undefined {
	if (path === "divider") {
		return theme.theme === "dark"
			? "rgba(255,255,255,0.12)"
			: "rgba(0,0,0,0.12)";
	}

	const mapped = MUI_PATH_MAP[path];
	if (mapped) {
		if (!mapped.token) return mapped.shade;
		return readToken(theme, mapped.token, mapped.shade ?? "main");
	}

	// native "bg-primary.main" / "text-error.light"
	const native = path.match(/^(bg-[\w-]+|text-[\w-]+)\.(light|dark|main|theme)$/);
	if (native) {
		return readToken(theme, native[1], native[2]);
	}

	// bare token "bg-primary" → theme shade
	if (path.startsWith("bg-") || path.startsWith("text-")) {
		return readToken(theme, path, "theme");
	}

	return path;
}

export const COLOR_PROPS = new Set([
	"color",
	"backgroundColor",
	"bgcolor",
	"borderColor",
	"outlineColor",
	"fill",
	"stroke",
	"caretColor",
	"columnRuleColor",
	"textDecorationColor",
]);
