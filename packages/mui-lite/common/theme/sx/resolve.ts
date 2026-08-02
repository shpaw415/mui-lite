import { deepMerge } from "./merge";
import { serializeSx } from "./serialize";
import type {
	SxInput,
	SxObject,
	SxProps,
	SxResolveResult,
	ThemeLike,
} from "./types";

function isFunction(v: unknown): v is (theme: ThemeLike) => SxInput {
	return typeof v === "function";
}

/**
 * Flatten sx prop (arrays, callbacks) into a single SxObject.
 */
export function normalizeSx(theme: ThemeLike, sx: SxInput): SxObject {
	if (sx == null || sx === false) return {};

	if (Array.isArray(sx)) {
		const parts: SxObject[] = [];
		for (const item of sx) {
			if (item == null || item === false) continue;
			parts.push(normalizeSx(theme, item));
		}
		return deepMerge(...parts);
	}

	if (isFunction(sx)) {
		return normalizeSx(theme, sx(theme));
	}

	if (typeof sx === "object") {
		return sx as SxObject;
	}

	return {};
}

/**
 * Resolve sx → { style, className? }.
 */
export function resolveSx(
	theme: ThemeLike,
	sx: SxProps | undefined,
): SxResolveResult {
	if (sx == null || sx === false) return { style: {} };
	const obj = normalizeSx(theme, sx as SxInput);
	if (Object.keys(obj).length === 0) return { style: {} };
	return serializeSx(theme, obj);
}

/**
 * Legacy helper: only inline styles (drops media/pseudos into best-effort base).
 * Prefer resolveSx when className can be applied.
 */
export function sxToStyle(
	theme: ThemeLike,
	sx: SxProps | undefined,
): Record<string, unknown> {
	const { style } = resolveSx(theme, sx);
	return style as Record<string, unknown>;
}
