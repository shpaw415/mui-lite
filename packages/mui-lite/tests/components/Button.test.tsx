import { describe, expect, test } from "bun:test";
import Button from "../../mui/Button";
import { fireEvent, renderWithTheme, screen } from "../helpers/render";

describe("Button ripple", () => {
	test("spawns a ripple span on pointerdown", () => {
		const { container } = renderWithTheme(
			<Button variant="contained">Click me</Button>,
		);
		const btn = screen.getByRole("button", { name: "Click me" });
		expect(container.querySelector(".MUI_Ripple_span")).toBeNull();

		fireEvent.pointerDown(btn, { clientX: 20, clientY: 10, button: 0 });

		const ripple = container.querySelector(".MUI_Ripple_span") as HTMLElement;
		expect(ripple).toBeTruthy();
		expect(ripple.style.width).not.toBe("");
		expect(ripple.style.height).not.toBe("");
	});

	test("disableRipple does not spawn ink", () => {
		const { container } = renderWithTheme(
			<Button disableRipple>No ripple</Button>,
		);
		const btn = screen.getByRole("button", { name: "No ripple" });
		fireEvent.pointerDown(btn, { clientX: 10, clientY: 10, button: 0 });
		expect(container.querySelector(".MUI_Ripple_span")).toBeNull();
	});

	test("disabled button does not spawn ink", () => {
		const { container } = renderWithTheme(
			<Button disabled>Disabled</Button>,
		);
		const btn = screen.getByRole("button", { name: "Disabled" });
		// Ripple host is not mounted when disabled
		expect(container.querySelector(".MUI_Ripple_span")).toBeNull();
		fireEvent.pointerDown(btn, { clientX: 10, clientY: 10, button: 0 });
		expect(container.querySelector(".MUI_Ripple_span")).toBeNull();
	});
});
