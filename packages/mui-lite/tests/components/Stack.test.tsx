import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import Stack from "../../mui/Stack";

describe("Stack", () => {
	test("renders children with flex direction", () => {
		renderWithTheme(
			<Stack data-testid="stack" direction="row" spacing={2}>
				<span>a</span>
				<span>b</span>
			</Stack>,
		);
		const el = screen.getByTestId("stack");
		expect(el.className).toContain("MUI_Stack");
		expect(el.style.flexDirection).toBe("row");
		expect(el.style.gap).toBe("16px");
	});

	test("inserts dividers", () => {
		renderWithTheme(
			<Stack data-testid="stack" divider={<hr data-testid="div" />}>
				<span>a</span>
				<span>b</span>
			</Stack>,
		);
		expect(screen.getAllByTestId("div").length).toBe(1);
	});
});
