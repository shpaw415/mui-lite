import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import Container from "../../mui/Container";

describe("Container", () => {
	test("applies maxWidth class", () => {
		renderWithTheme(
			<Container data-testid="c-md" maxWidth="md">
				hi
			</Container>,
		);
		const el = screen.getByTestId("c-md");
		expect(el.className).toContain("MUI_Container");
		expect(el.className).toContain("maxWidth-md");
	});

	test("disableGutters", () => {
		renderWithTheme(
			<Container data-testid="c-gutter" disableGutters>
				hi
			</Container>,
		);
		expect(screen.getByTestId("c-gutter").className).toContain("disableGutters");
	});
});
