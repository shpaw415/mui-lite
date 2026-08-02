/** Deep-merge plain objects; arrays replaced; later sources win */
export function deepMerge<T extends Record<string, unknown>>(
	...sources: Array<T | null | undefined | false>
): T {
	const result: Record<string, unknown> = {};
	for (const src of sources) {
		if (!src || typeof src !== "object") continue;
		for (const [key, val] of Object.entries(src)) {
			if (
				val &&
				typeof val === "object" &&
				!Array.isArray(val) &&
				result[key] &&
				typeof result[key] === "object" &&
				!Array.isArray(result[key])
			) {
				result[key] = deepMerge(
					result[key] as Record<string, unknown>,
					val as Record<string, unknown>,
				);
			} else if (val !== undefined) {
				result[key] = val;
			}
		}
	}
	return result as T;
}
