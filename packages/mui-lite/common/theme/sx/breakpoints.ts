import {
	BREAKPOINT_KEYS,
	type Breakpoint,
	type BreakpointValues,
	DEFAULT_BREAKPOINTS,
	type ThemeLike,
} from "./types";

export function getBreakpoints(theme: ThemeLike): BreakpointValues {
	return { ...DEFAULT_BREAKPOINTS, ...theme.breakpoints };
}

export function isBreakpointKey(key: string): key is Breakpoint {
	return (BREAKPOINT_KEYS as string[]).includes(key);
}

/** min-width media query for breakpoint key (xs = 0 → always) */
export function up(theme: ThemeLike, key: Breakpoint | number): string {
	const bp = getBreakpoints(theme);
	const value = typeof key === "number" ? key : bp[key];
	if (value <= 0) return "";
	return `@media (min-width:${value}px)`;
}

export function isResponsiveObject(value: unknown): value is Record<string, unknown> {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const keys = Object.keys(value);
	if (keys.length === 0) return false;
	return keys.every(
		(k) =>
			isBreakpointKey(k) ||
			k === "base" ||
			!Number.isNaN(Number(k)),
	);
}

/** Sort breakpoint keys by min-width ascending */
export function sortBreakpointEntries(
	theme: ThemeLike,
	obj: Record<string, unknown>,
): Array<[Breakpoint | string, unknown]> {
	const bp = getBreakpoints(theme);
	return Object.entries(obj).sort(([a], [b]) => {
		const av = isBreakpointKey(a) ? bp[a] : Number(a) || 0;
		const bv = isBreakpointKey(b) ? bp[b] : Number(b) || 0;
		return av - bv;
	});
}
