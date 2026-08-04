import { describe, expect, test } from "bun:test";
import { computeRippleGeometry } from "../../common/ripple";
import Button from "../../mui/Button";
import IconButton from "../../mui/IconButton";
import Switch from "../../mui/Switch";
import { fireEvent, renderWithTheme, screen } from "../helpers/render";

function mockRect(
	el: HTMLElement,
	rect: { left: number; top: number; width: number; height: number },
) {
	Object.defineProperty(el, "offsetWidth", {
		configurable: true,
		get: () => rect.width,
	});
	Object.defineProperty(el, "offsetHeight", {
		configurable: true,
		get: () => rect.height,
	});
	el.getBoundingClientRect = () =>
		({
			left: rect.left,
			top: rect.top,
			right: rect.left + rect.width,
			bottom: rect.top + rect.height,
			width: rect.width,
			height: rect.height,
			x: rect.left,
			y: rect.top,
			toJSON: () => ({}),
		}) as DOMRect;
}

describe("computeRippleGeometry", () => {
	test("centers the circle on the press point", () => {
		const el = document.createElement("div");
		// Host at (100, 50), size 200×100. Click at local (50, 25) → viewport (150, 75)
		mockRect(el, { left: 100, top: 50, width: 200, height: 100 });

		const { x, y, size } = computeRippleGeometry(el, 150, 75);

		// Furthest corner from (50, 25) is (200, 100):
		// dist = sqrt(150^2 + 75^2) = 167.705..., diameter = 2 * dist
		const expectedSize = Math.sqrt(150 ** 2 + 75 ** 2) * 2;
		expect(size).toBeCloseTo(expectedSize, 5);
		// Circle top-left so center is at press point
		expect(x + size / 2).toBeCloseTo(50, 5);
		expect(y + size / 2).toBeCloseTo(25, 5);
	});

	test("covers the host from a corner press", () => {
		const el = document.createElement("div");
		mockRect(el, { left: 0, top: 0, width: 100, height: 80 });

		// Press top-left corner
		const { x, y, size } = computeRippleGeometry(el, 0, 0);
		const expectedSize = Math.sqrt(100 ** 2 + 80 ** 2) * 2;
		expect(size).toBeCloseTo(expectedSize, 5);
		expect(x + size / 2).toBeCloseTo(0, 5);
		expect(y + size / 2).toBeCloseTo(0, 5);
	});

	test("center option origins at the middle of the host", () => {
		const el = document.createElement("div");
		mockRect(el, { left: 10, top: 20, width: 40, height: 40 });

		const { x, y, size } = computeRippleGeometry(el, 0, 0, { center: true });
		// From center (20, 20) to corner: dist = sqrt(20^2+20^2), diameter = 2*dist
		const expectedSize = Math.sqrt(20 ** 2 + 20 ** 2) * 2;
		expect(size).toBeCloseTo(expectedSize, 5);
		expect(x + size / 2).toBeCloseTo(20, 5);
		expect(y + size / 2).toBeCloseTo(20, 5);
	});

	test("accounts for CSS scale via offsetWidth vs getBoundingClientRect", () => {
		const el = document.createElement("div");
		// Layout size 100×100, rendered at 2× scale → rect 200×200
		Object.defineProperty(el, "offsetWidth", {
			configurable: true,
			get: () => 100,
		});
		Object.defineProperty(el, "offsetHeight", {
			configurable: true,
			get: () => 100,
		});
		el.getBoundingClientRect = () =>
			({
				left: 0,
				top: 0,
				right: 200,
				bottom: 200,
				width: 200,
				height: 200,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}) as DOMRect;

		// Viewport click at (100, 100) → local (50, 50)
		const { x, y, size } = computeRippleGeometry(el, 100, 100);
		expect(x + size / 2).toBeCloseTo(50, 5);
		expect(y + size / 2).toBeCloseTo(50, 5);
	});
});

describe("Button ripple placement", () => {
	test("spawns a ripple span on pointerdown inside MUI_Ripple_root", () => {
		const { container } = renderWithTheme(
			<Button variant="contained">Click me</Button>,
		);
		const btn = screen.getByRole("button", { name: "Click me" });
		expect(container.querySelector(".MUI_Ripple_span")).toBeNull();
		expect(container.querySelector(".MUI_Ripple_root")).toBeTruthy();

		// Stub geometry so placement is deterministic in happy-dom
		const root = container.querySelector(".MUI_Ripple_root") as HTMLElement;
		mockRect(root, { left: 0, top: 0, width: 100, height: 40 });
		mockRect(btn, { left: 0, top: 0, width: 100, height: 40 });

		fireEvent.pointerDown(btn, { clientX: 25, clientY: 10, button: 0 });

		const ripple = container.querySelector(".MUI_Ripple_span") as HTMLElement;
		expect(ripple).toBeTruthy();
		const left = parseFloat(ripple.style.left);
		const top = parseFloat(ripple.style.top);
		const size = parseFloat(ripple.style.width);
		// Center of the ink circle must be the press point (25, 10)
		expect(left + size / 2).toBeCloseTo(25, 4);
		expect(top + size / 2).toBeCloseTo(10, 4);
		expect(ripple.style.height).toBe(ripple.style.width);
	});

	test("disableRipple does not mount the ink layer", () => {
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
		expect(container.querySelector(".MUI_Ripple_root")).toBeNull();
		fireEvent.pointerDown(btn, { clientX: 10, clientY: 10, button: 0 });
		expect(container.querySelector(".MUI_Ripple_span")).toBeNull();
	});

	test("text button applies palette color class on the ripple root", () => {
		const { container } = renderWithTheme(
			<Button variant="text" color="secondary">
				Secondary
			</Button>,
		);
		const root = container.querySelector(".MUI_Ripple_root") as HTMLElement;
		expect(root).toBeTruthy();
		expect(root.className).toMatch(/_secondary|secondary/);
	});

	test("contained button inherits host color (no forced palette class)", () => {
		const { container } = renderWithTheme(
			<Button variant="contained" color="error">
				Error
			</Button>,
		);
		const root = container.querySelector(".MUI_Ripple_root") as HTMLElement;
		expect(root).toBeTruthy();
		// Contained ink stays contrast (white) via inherit — no _error on ripple root
		expect(root.className.includes("_error")).toBe(false);
	});

	test("IconButton forwards color to the ripple root", () => {
		const { container } = renderWithTheme(
			<IconButton color="warning" aria-label="warn">
				!
			</IconButton>,
		);
		const root = container.querySelector(".MUI_Ripple_root") as HTMLElement;
		expect(root.className).toMatch(/_warning|warning/);
	});

	test("Switch uses its color prop on the ripple root", () => {
		const { container } = renderWithTheme(<Switch color="error" />);
		const root = container.querySelector(".MUI_Ripple_root") as HTMLElement;
		expect(root).toBeTruthy();
		expect(root.className).toMatch(/_error|error/);
	});
});
