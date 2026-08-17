import { describe, expect, test } from "bun:test";
import Select from "../../mui/Select";
import { act, fireEvent, renderWithTheme, screen } from "../helpers/render";

describe("Select", () => {
	test("renders with default value label", () => {
		renderWithTheme(
			<Select name="fruit" label="Fruit" defaultValue="apple">
				<option value="apple">Apple</option>
				<option value="banana">Banana</option>
			</Select>,
		);
		expect(screen.getByDisplayValue("Apple")).toBeTruthy();
	});

	test("opens menu and selects an option", () => {
		renderWithTheme(
			<Select name="fruit" label="Fruit" defaultValue="apple">
				<option value="apple">Apple</option>
				<option value="banana">Banana</option>
			</Select>,
		);
		const input = screen.getByDisplayValue("Apple");
		fireEvent.click(input);
		// Menu is fixed-positioned; initial frame may be visibility:hidden until measure
		expect(screen.getByRole("listbox", { hidden: true })).toBeTruthy();
		const banana = document.querySelector(
			'[role="option"][e-value="banana"]',
		) as HTMLElement;
		expect(banana).toBeTruthy();
		fireEvent.click(banana);
		expect(screen.getByDisplayValue("Banana")).toBeTruthy();
		const hidden = document.querySelector(
			'input[type="hidden"][name="fruit"]',
		) as HTMLInputElement;
		expect(hidden?.value).toBe("banana");
	});

	test("menu is portaled outside Select root when open", () => {
		const { container } = renderWithTheme(
			<div style={{ overflow: "hidden", height: 40 }}>
				<Select name="fruit" defaultValue="a">
					<option value="a">A</option>
					<option value="b">B</option>
				</Select>
			</div>,
		);
		const root = container.querySelector(".MUI_Select_Root");
		expect(root?.className.includes("_open")).toBe(false);
		expect(root?.querySelector(".MUI_Select_DropDown_Root")).toBeNull();

		fireEvent.click(screen.getByDisplayValue("A"));

		expect(root?.className.includes("_open")).toBe(true);
		// Menu is portaled — not a descendant of Select root
		expect(root?.querySelector(".MUI_Menu_Root")).toBeNull();
		const menu = document.querySelector(".MUI_Select_DropDown_Root");
		expect(menu).toBeTruthy();
		expect(menu?.className.includes("MUI_Menu_Root")).toBe(true);
		expect(root?.contains(menu)).toBe(false);
	});

	test("does not close when scrolling the dropdown list", () => {
		renderWithTheme(
			<Select name="fruit" defaultValue="a">
				<option value="a">A</option>
				<option value="b">B</option>
			</Select>,
		);
		fireEvent.click(screen.getByDisplayValue("A"));
		const menu = document.querySelector(".MUI_Menu_Root") as HTMLElement;
		expect(menu).toBeTruthy();
		act(() => {
			menu.dispatchEvent(new Event("scroll", { bubbles: true }));
		});
		expect(document.querySelector(".MUI_Menu_Root")).toBeTruthy();
	});

	test("closes on page scroll by default", () => {
		renderWithTheme(
			<Select name="fruit" defaultValue="a">
				<option value="a">A</option>
				<option value="b">B</option>
			</Select>,
		);
		fireEvent.click(screen.getByDisplayValue("A"));
		expect(document.querySelector(".MUI_Menu_Root")).toBeTruthy();
		act(() => {
			document.dispatchEvent(new Event("scroll", { bubbles: true }));
		});
		expect(document.querySelector(".MUI_Menu_Root")).toBeNull();
	});

	test("honors SlotProps dropdown-wrapper closeOnScroll", () => {
		renderWithTheme(
			<Select
				name="fruit"
				defaultValue="a"
				SlotProps={{ "dropdown-wrapper": { closeOnScroll: false } }}
			>
				<option value="a">A</option>
				<option value="b">B</option>
			</Select>,
		);
		fireEvent.click(screen.getByDisplayValue("A"));
		expect(document.querySelector(".MUI_Menu_Root")).toBeTruthy();
		act(() => {
			document.dispatchEvent(new Event("scroll", { bubbles: true }));
		});
		expect(document.querySelector(".MUI_Menu_Root")).toBeTruthy();
	});
});
