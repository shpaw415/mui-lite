const cache = new Map<string, string>();
let styleEl: HTMLStyleElement | null = null;
let counter = 0;

function ensureSheet(): HTMLStyleElement | null {
	if (typeof document === "undefined") return null;
	if (styleEl?.isConnected) return styleEl;
	const el = document.createElement("style");
	el.setAttribute("data-mui-lite-sx", "");
	document.head.appendChild(el);
	styleEl = el;
	return el;
}

function simpleHash(input: string): string {
	let h = 5381;
	for (let i = 0; i < input.length; i++) {
		h = (h * 33) ^ input.charCodeAt(i);
	}
	return (h >>> 0).toString(36);
}

/**
 * Inject CSS once. `cssText` may use `&` as the class placeholder
 * (e.g. `&:hover{color:red}` or `@media (min-width:900px){&{padding:8px}}`).
 */
export function injectCss(cssText: string): string {
	if (!cssText.trim()) return "";
	const existing = cache.get(cssText);
	if (existing) return existing;

	const name = `ml-sx-${simpleHash(cssText)}-${(counter++).toString(36)}`;
	const finalCss = cssText.replace(/&/g, `.${name}`);
	cache.set(cssText, name);

	const s = ensureSheet();
	if (s) {
		s.textContent = `${s.textContent || ""}\n${finalCss}\n`;
	}

	return name;
}

export function resetSxCache() {
	cache.clear();
	counter = 0;
	if (typeof document !== "undefined") {
		document
			.querySelectorAll("style[data-mui-lite-sx]")
			.forEach((n) => n.remove());
	}
	styleEl = null;
}
