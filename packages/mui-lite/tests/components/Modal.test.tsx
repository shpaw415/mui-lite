import { describe, expect, test, mock } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import Modal from "../../mui/Modal";

describe("Modal", () => {
	test("does not render when closed", () => {
		renderWithTheme(
			<Modal open={false}>
				<div data-testid="modal-closed">hi</div>
			</Modal>,
		);
		expect(screen.queryByTestId("modal-closed")).toBeNull();
	});

	test("renders children when open", () => {
		renderWithTheme(
			<Modal open>
				<div data-testid="modal-open">hi</div>
			</Modal>,
		);
		expect(screen.getByTestId("modal-open")).toBeTruthy();
	});

	test("calls onClose on Escape", () => {
		const onClose = mock(() => {});
		renderWithTheme(
			<Modal open onClose={onClose}>
				<div>body</div>
			</Modal>,
		);
		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
		expect(onClose).toHaveBeenCalled();
	});

	test("keepMounted keeps DOM when closed", () => {
		renderWithTheme(
			<Modal open={false} keepMounted>
				<div data-testid="modal-keep">hi</div>
			</Modal>,
		);
		expect(screen.getByTestId("modal-keep")).toBeTruthy();
	});

	test("does not lock scroll when closed at mount", () => {
		renderWithTheme(
			<Modal open={false}>
				<div>hi</div>
			</Modal>,
		);
		expect(document.documentElement.style.overflowY).not.toBe("hidden");
	});

	test("keepMounted closed does not lock scroll", () => {
		renderWithTheme(
			<Modal open={false} keepMounted>
				<div>hi</div>
			</Modal>,
		);
		expect(document.documentElement.style.overflowY).not.toBe("hidden");
	});

	test("locks while open and restores on close", () => {
		const { rerender } = renderWithTheme(
			<Modal open>
				<div>hi</div>
			</Modal>,
		);
		expect(document.documentElement.style.overflowY).toBe("hidden");
		rerender(
			<Modal open={false}>
				<div>hi</div>
			</Modal>,
		);
		expect(document.documentElement.style.overflowY).not.toBe("hidden");
	});

	test("disableScrollLock skips the page lock", () => {
		renderWithTheme(
			<Modal open disableScrollLock>
				<div>hi</div>
			</Modal>,
		);
		expect(document.documentElement.style.overflowY).not.toBe("hidden");
	});
});

