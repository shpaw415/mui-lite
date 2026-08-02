import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import Collapse from "../../mui/Collapse";

describe("Collapse", () => {
	test("renders when open", () => {
		renderWithTheme(
			<Collapse open data-testid="col">
				<div>inside</div>
			</Collapse>,
		);
		expect(screen.getByTestId("col").textContent).toContain("inside");
		expect(screen.getByTestId("col").className).toContain("open");
	});

	test("supports in prop alias", () => {
		renderWithTheme(
			<Collapse in data-testid="col">
				x
			</Collapse>,
		);
		expect(screen.getByTestId("col").className).toContain("open");
	});

	test("closed without unmountOnExit stays mounted", () => {
		renderWithTheme(
			<Collapse open={false} data-testid="col">
				gone
			</Collapse>,
		);
		expect(screen.getByTestId("col")).toBeTruthy();
	});
});
