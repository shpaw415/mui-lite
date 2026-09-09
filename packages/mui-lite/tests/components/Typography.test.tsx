import { describe, expect, test } from "bun:test";
import Typography from "../../mui/Typography";
import { renderWithTheme, screen } from "../helpers/render";

describe("Typography", () => {
	test("applies spacing from sx", () => {
		renderWithTheme(
			<Typography data-testid="t" sx={{ mb: 2 }}>
				x
			</Typography>,
		);
		const el = screen.getByTestId("t") as HTMLElement;
		expect(el.style.marginBottom).toBe("16px");
	});

	test("nested sm/lg display injects media class after extra props", () => {
		renderWithTheme(
			<Typography
				data-testid="t"
				sx={{ sm: { display: "none" }, lg: { display: "flex" } }}
				style={{}}
			>
				x
			</Typography>,
		);
		const el = screen.getByTestId("t") as HTMLElement;
		expect(el.className).toMatch(/ml-sx-/);
		expect(el.style.display).toBe("");
		const sheet = document.querySelector("style[data-mui-lite-sx]");
		const css = sheet?.textContent ?? "";
		expect(css.indexOf("min-width:600px")).toBeLessThan(
			css.indexOf("min-width:1200px"),
		);
		expect(css.indexOf("display:none")).toBeLessThan(css.indexOf("display:flex"));
	});
});
