import { describe, expect, test } from "bun:test";
import Dialog from "../../mui/Dialog";
import { renderWithTheme, screen } from "../helpers/render";

function overflowY() {
	return document.documentElement.style.overflowY;
}

describe("Dialog", () => {
	test("does not render or lock scroll when closed at mount", () => {
		renderWithTheme(
			<Dialog open={false}>
				<div data-testid="dialog-closed">x</div>
			</Dialog>,
		);
		expect(screen.queryByTestId("dialog-closed")).toBeNull();
		expect(document.querySelector(".MUI_Dialog_Root")).toBeNull();
		expect(overflowY()).not.toBe("hidden");
	});

	test("keepMounted closed does not lock scroll", () => {
		renderWithTheme(
			<Dialog open={false} keepMounted>
				<div data-testid="dialog-keep">x</div>
			</Dialog>,
		);
		expect(screen.getByTestId("dialog-keep")).toBeTruthy();
		expect(overflowY()).not.toBe("hidden");
		expect(document.querySelector(".MUI_Dialog_Root._open")).toBeNull();
	});

	test("does not lock when open unless preventBodyScroll is set", () => {
		renderWithTheme(
			<Dialog open>
				<div>body</div>
			</Dialog>,
		);
		expect(overflowY()).not.toBe("hidden");
	});

	test("locks while open with preventBodyScroll and restores on close", () => {
		const { rerender } = renderWithTheme(
			<Dialog open preventBodyScroll>
				<div>body</div>
			</Dialog>,
		);
		expect(overflowY()).toBe("hidden");
		rerender(
			<Dialog open={false} preventBodyScroll>
				<div>body</div>
			</Dialog>,
		);
		expect(overflowY()).not.toBe("hidden");
	});
});
