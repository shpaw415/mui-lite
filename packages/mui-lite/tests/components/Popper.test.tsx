import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import Popper from "../../mui/Popper";

describe("Popper", () => {
	test("hidden when closed", () => {
		renderWithTheme(
			<Popper open={false}>
				<div data-testid="p">content</div>
			</Popper>,
		);
		expect(screen.queryByTestId("p")).toBeNull();
	});

	test("renders when open with keepMounted when closed", () => {
		const anchor = document.createElement("button");
		document.body.appendChild(anchor);
		renderWithTheme(
			<Popper open anchorEl={anchor}>
				<div data-testid="p">hello</div>
			</Popper>,
		);
		expect(screen.getByTestId("p").textContent).toBe("hello");
		anchor.remove();
	});

	test("keepMounted", () => {
		renderWithTheme(
			<Popper open={false} keepMounted>
				<div data-testid="k">k</div>
			</Popper>,
		);
		expect(screen.getByTestId("k")).toBeTruthy();
	});
});
