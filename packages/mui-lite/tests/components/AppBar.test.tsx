import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import AppBar from "../../mui/AppBar";
import Toolbar from "../../mui/Toolbar";

describe("AppBar", () => {
	test("renders header with position and color classes", () => {
		renderWithTheme(
			<AppBar data-testid="bar" position="static" color="secondary">
				title
			</AppBar>,
		);
		const el = screen.getByTestId("bar");
		expect(el.tagName.toLowerCase()).toBe("header");
		expect(el.className).toContain("AppBar");
		expect(el.className).toContain("position-static");
		expect(el.className).toContain("color-secondary");
	});
});

describe("Toolbar", () => {
	test("applies gutters and variant", () => {
		renderWithTheme(
			<Toolbar data-testid="tb" variant="dense">
				tools
			</Toolbar>,
		);
		const el = screen.getByTestId("tb");
		expect(el.className).toContain("Toolbar");
		expect(el.className).toContain("dense");
		expect(el.className).toContain("gutters");
	});

	test("disableGutters", () => {
		renderWithTheme(
			<Toolbar data-testid="tb" disableGutters>
				x
			</Toolbar>,
		);
		expect(screen.getByTestId("tb").className).toContain("disableGutters");
	});
});
