import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import Link from "../../mui/Link";

describe("Link", () => {
	test("renders anchor with href", () => {
		renderWithTheme(
			<Link href="/docs" data-testid="l">
				Docs
			</Link>,
		);
		const el = screen.getByTestId("l");
		expect(el.tagName.toLowerCase()).toBe("a");
		expect(el.getAttribute("href")).toBe("/docs");
		expect(el.className).toContain("underline-always");
	});

	test("underline hover class", () => {
		renderWithTheme(
			<Link href="#" underline="hover" data-testid="l">
				x
			</Link>,
		);
		expect(screen.getByTestId("l").className).toContain("underline-hover");
	});
});
