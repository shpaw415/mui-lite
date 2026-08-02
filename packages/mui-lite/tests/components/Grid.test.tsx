import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import Grid from "../../mui/Grid";

describe("Grid", () => {
	test("container applies flex class", () => {
		renderWithTheme(
			<Grid container data-testid="g" spacing={2}>
				<Grid size={6}>a</Grid>
				<Grid size={6}>b</Grid>
			</Grid>,
		);
		const el = screen.getByTestId("g");
		expect(el.className).toContain("container");
		expect(el.style.display).toBe("flex");
		expect(el.style.columnGap || el.style.gap).toBeTruthy();
	});

	test("item size sets width percent", () => {
		renderWithTheme(
			<Grid data-testid="item" size={4}>
				x
			</Grid>,
		);
		const el = screen.getByTestId("item");
		expect(el.className).toContain("item");
		expect(el.style.width).toBe("33.33333333333333%");
	});
});
