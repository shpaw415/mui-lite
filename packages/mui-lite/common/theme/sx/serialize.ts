import {
	isBreakpointKey,
	isResponsiveObject,
	sortBreakpointEntries,
	up,
} from "./breakpoints";
import { injectCss } from "./inject";
import { expandSystemProp } from "./systemProps";
import type { Breakpoint, SxObject, SxResolveResult, ThemeLike } from "./types";

function camelToKebab(key: string): string {
	return key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function declsToCss(decls: Record<string, string | number>): string {
	return Object.entries(decls)
		.map(([k, v]) => `${camelToKebab(k)}:${v}`)
		.join(";");
}

type Bucket = {
	base: Record<string, string | number>;
	/** media query → decls */
	media: Map<string, Record<string, string | number>>;
	/** selector (with &) → decls */
	nested: Map<string, Record<string, string | number>>;
	/** selector → media → decls */
	nestedMedia: Map<string, Map<string, Record<string, string | number>>>;
};

function emptyBucket(): Bucket {
	return {
		base: {},
		media: new Map(),
		nested: new Map(),
		nestedMedia: new Map(),
	};
}

function assignDecls(
	target: Record<string, string | number>,
	decls: Record<string, string | number> | null,
) {
	if (!decls) return;
	Object.assign(target, decls);
}

function mediaMinWidth(mq: string): number {
	const m = /min-width:\s*(\d+)/.exec(mq);
	return m ? Number(m[1]) : 0;
}

function sortedMediaEntries<T>(map: Map<string, T>): Array<[string, T]> {
	return [...map.entries()].sort(
		(a, b) => mediaMinWidth(a[0]) - mediaMinWidth(b[0]),
	);
}

function walk(
	theme: ThemeLike,
	obj: SxObject,
	bucket: Bucket,
	nestedSelector?: string,
	mediaQuery?: string,
) {
	const breakpointBags: Partial<Record<Breakpoint, SxObject>> = {};

	for (const [key, raw] of Object.entries(obj)) {
		if (raw == null || raw === false) continue;

		if (
			isBreakpointKey(key) &&
			raw &&
			typeof raw === "object" &&
			!Array.isArray(raw)
		) {
			breakpointBags[key] = raw as SxObject;
			continue;
		}

		// nested selector / pseudo / @media string
		if (key.startsWith("&") || key.startsWith(":") || key.startsWith("@")) {
			if (raw && typeof raw === "object" && !Array.isArray(raw)) {
				const sel = key.startsWith("@") ? key : key;
				if (key.startsWith("@media") || key.startsWith("@supports")) {
					walk(theme, raw as SxObject, bucket, nestedSelector, key);
				} else {
					walk(theme, raw as SxObject, bucket, sel, mediaQuery);
				}
			}
			continue;
		}

		// responsive value object: width: { xs: 1, md: 0.5 }
		if (isResponsiveObject(raw)) {
			for (const [bp, bpVal] of sortBreakpointEntries(
				theme,
				raw as Record<string, unknown>,
			)) {
				if (bpVal == null) continue;
				const decls = expandSystemProp(theme, key, bpVal);
				if (!decls) continue;
				const mq =
					isBreakpointKey(bp) || bp === "base"
						? bp === "xs" || bp === "base"
							? ""
							: up(theme, bp as any)
						: up(theme, Number(bp));
				placeDecls(bucket, decls, nestedSelector, mq || mediaQuery);
			}
			continue;
		}

		// array responsive: [xs, sm, md] legacy MUI
		if (Array.isArray(raw)) {
			const bps = ["xs", "sm", "md", "lg", "xl"] as const;
			raw.forEach((bpVal, i) => {
				if (bpVal == null) return;
				const decls = expandSystemProp(theme, key, bpVal);
				if (!decls) return;
				const bp = bps[i] ?? "xl";
				const mq = bp === "xs" ? "" : up(theme, bp);
				placeDecls(bucket, decls, nestedSelector, mq || mediaQuery);
			});
			continue;
		}

		const decls = expandSystemProp(theme, key, raw);
		if (decls) {
			placeDecls(bucket, decls, nestedSelector, mediaQuery);
			continue;
		}

		// plain nested object that wasn't a color token — treat as nested if key looks like selector
		if (typeof raw === "object" && key.includes("&")) {
			walk(theme, raw as SxObject, bucket, key, mediaQuery);
		}
	}

	for (const [key, raw] of sortBreakpointEntries(
		theme,
		breakpointBags as Record<string, unknown>,
	)) {
		if (!raw || typeof raw !== "object" || !isBreakpointKey(key)) continue;
		const mq = up(theme, key);
		walk(
			theme,
			raw as SxObject,
			bucket,
			nestedSelector,
			mq || mediaQuery,
		);
	}
}

function placeDecls(
	bucket: Bucket,
	decls: Record<string, string | number>,
	nestedSelector?: string,
	mediaQuery?: string,
) {
	if (nestedSelector) {
		if (mediaQuery) {
			if (!bucket.nestedMedia.has(nestedSelector)) {
				bucket.nestedMedia.set(nestedSelector, new Map());
			}
			const m = bucket.nestedMedia.get(nestedSelector)!;
			const cur = m.get(mediaQuery) ?? {};
			assignDecls(cur, decls);
			m.set(mediaQuery, cur);
		} else {
			const cur = bucket.nested.get(nestedSelector) ?? {};
			assignDecls(cur, decls);
			bucket.nested.set(nestedSelector, cur);
		}
		return;
	}
	if (mediaQuery) {
		const cur = bucket.media.get(mediaQuery) ?? {};
		assignDecls(cur, decls);
		bucket.media.set(mediaQuery, cur);
	} else {
		assignDecls(bucket.base, decls);
	}
}

function collectOverrideKeys(bucket: Bucket): Set<string> {
	const keys = new Set<string>();
	const add = (decls: Record<string, string | number>) => {
		for (const k of Object.keys(decls)) keys.add(k);
	};
	for (const decls of bucket.media.values()) add(decls);
	for (const [sel, decls] of bucket.nested) {
		if (sel !== "&") add(decls);
	}
	for (const mediaMap of bucket.nestedMedia.values()) {
		for (const decls of mediaMap.values()) add(decls);
	}
	return keys;
}

function hoistInlineConflicts(bucket: Bucket) {
	const overrideKeys = collectOverrideKeys(bucket);
	const hoist: Record<string, string | number> = {};
	for (const k of overrideKeys) {
		if (k in bucket.base) {
			hoist[k] = bucket.base[k];
			delete bucket.base[k];
		}
	}
	if (Object.keys(hoist).length === 0) return;
	const cur = bucket.nested.get("&") ?? {};
	bucket.nested.set("&", { ...hoist, ...cur });
}

function buildCssText(bucket: Bucket): string {
	const parts: string[] = [];

	const nestedEntries = [...bucket.nested.entries()].sort(([a], [b]) =>
		a === "&" ? -1 : b === "&" ? 1 : 0,
	);
	for (const [sel, decls] of nestedEntries) {
		const body = declsToCss(decls);
		if (!body) continue;
		parts.push(`${sel}{${body}}`);
	}

	for (const [mq, decls] of sortedMediaEntries(bucket.media)) {
		const body = declsToCss(decls);
		if (!body) continue;
		parts.push(`${mq}{&{${body}}}`);
	}

	for (const [sel, mediaMap] of bucket.nestedMedia) {
		for (const [mq, decls] of sortedMediaEntries(mediaMap)) {
			const body = declsToCss(decls);
			if (!body) continue;
			parts.push(`${mq}{${sel}{${body}}}`);
		}
	}

	return parts.join("\n");
}

/**
 * Serialize a fully normalized (merged) sx object into style + optional className.
 */
export function serializeSx(theme: ThemeLike, obj: SxObject): SxResolveResult {
	const bucket = emptyBucket();
	walk(theme, obj, bucket);
	hoistInlineConflicts(bucket);

	const style = { ...bucket.base } as SxResolveResult["style"];
	const cssText = buildCssText(bucket);

	if (!cssText) {
		return { style };
	}

	const className = injectCss(cssText);
	return { style, className, cssText };
}
