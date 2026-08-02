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
});
