import { afterEach, describe, expect, test } from "bun:test";
import { DefaultTheme } from "../../common/theme";
import {
	normalizeSx,
	resetSxCache,
	resolveColorValue,
	resolveSx,
} from "../../common/theme/sx";

const theme = { ...DefaultTheme, theme: "light" as const };

afterEach(() => {
	resetSxCache();
});

describe("resolveSx", () => {
	test("spacing shorthands", () => {
		const { style } = resolveSx(theme, { m: 2, px: 1, mt: 0.5 });
		expect(style.margin).toBe("16px");
		expect(style.paddingLeft).toBe("8px");
		expect(style.paddingRight).toBe("8px");
		expect(style.marginTop).toBe("4px");
	});

	test("palette path strings", () => {
		const { style } = resolveSx(theme, {
			color: "primary.main",
			bgcolor: "background.paper",
		});
		expect(style.color).toBe(theme["bg-primary"].main);
		expect(style.backgroundColor).toBe(theme["bg-surface"].light);
	});

	test("legacy color token objects", () => {
		const { style } = resolveSx(theme, {
			backgroundColor: { "bg-primary": "theme" },
			color: { "text-main": "theme" },
		});
		expect(style.backgroundColor).toBe(theme["bg-primary"].light);
		expect(style.color).toBe(theme["text-main"].light);
	});

	test("theme callback", () => {
		const { style } = resolveSx(theme, (t) => ({
			color: t.theme === "light" ? "red" : "blue",
			p: 1,
		}));
		expect(style.color).toBe("red");
		expect(style.padding).toBe("8px");
	});

	test("array merge (later wins)", () => {
		const { style } = resolveSx(theme, [
			{ color: "red", p: 1 },
			{ color: "blue" },
			false,
			null,
		]);
		expect(style.color).toBe("blue");
		expect(style.padding).toBe("8px");
	});

	test("responsive object values inject media class", () => {
		const { style, className, cssText } = resolveSx(theme, {
			width: { xs: 1, md: 0.5 },
		});
		expect(style.width).toBe("100%");
		expect(className).toBeTruthy();
		expect(cssText).toContain("@media (min-width:900px)");
		expect(cssText).toContain("width:50%");
	});

	test("nested breakpoint bag", () => {
		const { style, cssText } = resolveSx(theme, {
			p: 1,
			md: { p: 3 },
		});
		expect(style.padding).toBe("8px");
		expect(cssText).toContain("@media (min-width:900px)");
		expect(cssText).toContain("padding:24px");
	});

	test("pseudo selectors inject class", () => {
		const { style, className, cssText } = resolveSx(theme, {
			color: "red",
			"&:hover": { color: "blue" },
		});
		expect(style.color).toBe("red");
		expect(className).toBeTruthy();
		expect(cssText).toContain("&:hover");
		expect(cssText).toContain("color:blue");
	});

	test("width fraction", () => {
		const { style } = resolveSx(theme, { width: 0.5, height: 200 });
		expect(style.width).toBe("50%");
		expect(style.height).toBe(200);
	});

	test("typography preset", () => {
		const { style } = resolveSx(theme, { typography: "h6" });
		expect(style.fontSize).toBe("1.125rem");
		expect(style.fontWeight).toBe(500);
	});

	test("custom spacing function on theme", () => {
		const t = {
			...theme,
			spacing: (n: number) => `${n * 4}px`,
		};
		const { style } = resolveSx(t, { m: 3 });
		expect(style.margin).toBe("12px");
	});
});

describe("normalizeSx", () => {
	test("flattens nested callbacks in arrays", () => {
		const obj = normalizeSx(theme, [
			{ p: 1 },
			(t) => ({ color: t["text-main"].main }),
		]);
		expect(obj.p).toBe(1);
		expect(obj.color).toBe(theme["text-main"].main);
	});
});

describe("resolveColorValue", () => {
	test("raw css colors pass through", () => {
		expect(resolveColorValue(theme, "#fff")).toBe("#fff");
		expect(resolveColorValue(theme, "rgb(1,2,3)")).toBe("rgb(1,2,3)");
		expect(resolveColorValue(theme, "var(--x)")).toBe("var(--x)");
	});

	test("error.main", () => {
		expect(resolveColorValue(theme, "error.main")).toBe(
			theme["bg-error"].main,
		);
	});
});
