import { describe, expect, test, mock } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import Popover from "../../mui/Popover";

describe("Popover", () => {
	test("does not show when closed", () => {
		renderWithTheme(
			<Popover open={false}>
				<div data-testid="c">x</div>
			</Popover>,
		);
		expect(screen.queryByTestId("c")).toBeNull();
	});

	test("shows paper content when open", () => {
		const anchor = document.createElement("button");
		document.body.appendChild(anchor);
		renderWithTheme(
			<Popover open anchorEl={anchor}>
				<div data-testid="c">popover body</div>
			</Popover>,
		);
		expect(screen.getByTestId("c").textContent).toBe("popover body");
		anchor.remove();
	});

	test("Escape calls onClose", () => {
		const onClose = mock(() => {});
		const anchor = document.createElement("button");
		document.body.appendChild(anchor);
		renderWithTheme(
			<Popover open anchorEl={anchor} onClose={onClose}>
				<div>x</div>
			</Popover>,
		);
		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
		expect(onClose).toHaveBeenCalled();
		anchor.remove();
	});
});
