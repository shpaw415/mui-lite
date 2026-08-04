import { describe, expect, test, mock } from "bun:test";
import { cleanup, fireEvent, renderWithTheme, screen } from "../helpers/render";
import CheckBox from "../../mui/CheckBox";
import FormControlLabel from "../../mui/FormControlLabel";

describe("CheckBox", () => {
	test("toggles checked state on a single click (no double-fire)", () => {
		const onChange = mock(() => {});
		renderWithTheme(<CheckBox onChange={onChange} data-testid="cb" />);
		const input = document.querySelector(
			'input[type="checkbox"]',
		) as HTMLInputElement;
		expect(input).toBeTruthy();
		expect(input.checked).toBe(false);

		fireEvent.click(input);
		expect(input.checked).toBe(true);
		expect(onChange).toHaveBeenCalledTimes(1);

		fireEvent.click(input);
		expect(input.checked).toBe(false);
		expect(onChange).toHaveBeenCalledTimes(2);
	});

	test("does not nest the input inside a button", () => {
		renderWithTheme(<CheckBox />);
		const input = document.querySelector(
			'input[type="checkbox"]',
		) as HTMLInputElement;
		expect(input.closest("button")).toBeNull();
	});

	test("pointerdown on the host does not toggle without a real click", () => {
		// Regression: Ripple used to call input.click() on pointerdown, then the
		// native click on release toggled again — net zero state change.
		renderWithTheme(<CheckBox />);
		const input = document.querySelector(
			'input[type="checkbox"]',
		) as HTMLInputElement;
		const host = input.closest(".MUI_Checkbox_root") as HTMLElement;
		expect(host).toBeTruthy();

		fireEvent.pointerDown(host, { button: 0, clientX: 10, clientY: 10 });
		// Only the visual ripple path runs; checked stays false until click.
		expect(input.checked).toBe(false);

		fireEvent.click(input);
		expect(input.checked).toBe(true);
	});

	test("input covers the full circular host (icon + padding)", () => {
		renderWithTheme(<CheckBox />);
		const input = document.querySelector(
			'input[type="checkbox"]',
		) as HTMLInputElement;
		const host = input.closest(".MUI_Checkbox_root") as HTMLElement;
		expect(input.parentElement).toBe(host);
		expect(input.className).toContain("MUI_Checkbox_input");
	});

	test("respects defaultChecked and controlled checked", () => {
		const { unmount } = renderWithTheme(<CheckBox defaultChecked />);
		let input = document.querySelector(
			'input[type="checkbox"]',
		) as HTMLInputElement;
		expect(input.checked).toBe(true);
		unmount();
		cleanup();

		renderWithTheme(<CheckBox checked onChange={() => {}} />);
		input = document.querySelector(
			'input[type="checkbox"]',
		) as HTMLInputElement;
		expect(input.checked).toBe(true);
	});

	test("works with FormControlLabel onChange", () => {
		const onChange = mock(() => {});
		renderWithTheme(
			<FormControlLabel
				control={<CheckBox />}
				label="Accept"
				onChange={onChange}
			/>,
		);
		const input = document.querySelector(
			'input[type="checkbox"]',
		) as HTMLInputElement;
		fireEvent.click(input);
		expect(onChange).toHaveBeenCalled();
		expect(input.checked).toBe(true);
		expect(screen.getByText("Accept")).toBeTruthy();
	});

	test("disabled prevents interaction", () => {
		renderWithTheme(<CheckBox disabled />);
		const input = document.querySelector(
			'input[type="checkbox"]',
		) as HTMLInputElement;
		expect(input.disabled).toBe(true);
	});
});
