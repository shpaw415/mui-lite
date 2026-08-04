import { describe, expect, mock, test } from "bun:test";
import Rating from "../../mui/Rating";
import { fireEvent, renderWithTheme, screen } from "../helpers/render";

describe("Rating", () => {
	test("half-star precision renders two radios per star", () => {
		renderWithTheme(
			<Rating defaultValue={2} max={5} precision={0.5} name="r1" />,
		);
		const radios = document.querySelectorAll('input[type="radio"]');
		// 5 stars × 2 halves
		expect(radios.length).toBe(10);
	});

	test("whole-star precision renders one radio per star", () => {
		renderWithTheme(
			<Rating defaultValue={2} max={5} precision={1} name="r1b" />,
		);
		expect(document.querySelectorAll('input[type="radio"]').length).toBe(5);
	});

	test("onChange with half steps", () => {
		const onChange = mock(() => {});
		renderWithTheme(
			<Rating value={1} onChange={onChange} name="r2" max={3} precision={0.5} />,
		);
		const radios = document.querySelectorAll(
			'input[name="r2"]',
		) as NodeListOf<HTMLInputElement>;
		// values: 0.5, 1, 1.5, 2, 2.5, 3 — pick 2.5
		const half = [...radios].find((r) => r.value === "2.5");
		expect(half).toBeTruthy();
		fireEvent.click(half!);
		expect(onChange).toHaveBeenCalled();
		const [, val] = onChange.mock.calls[0] as [unknown, number | null];
		expect(val).toBe(2.5);
	});

	test("hover sets previewing class", () => {
		const { container } = renderWithTheme(
			<Rating defaultValue={1} max={5} precision={0.5} name="r3" />,
		);
		const root = container.querySelector(".MUI_Rating") as HTMLElement;
		const { left, width } = { left: 0, width: 100 };
		root.getBoundingClientRect = () =>
			({
				left,
				width,
				top: 0,
				height: 24,
				right: width,
				bottom: 24,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}) as DOMRect;

		fireEvent.mouseMove(root, { clientX: 70, clientY: 10 });
		expect(root.className.includes("_previewing")).toBe(true);
		fireEvent.mouseLeave(root);
		expect(root.className.includes("_previewing")).toBe(false);
	});

	test("readOnly exposes img role", () => {
		renderWithTheme(
			<Rating value={3.5} precision={0.5} readOnly name="r4" />,
		);
		expect(screen.getByRole("img")).toBeTruthy();
	});

	test("applies palette color class on the root", () => {
		const { container } = renderWithTheme(
			<Rating name="r-color" defaultValue={3} color="error" readOnly />,
		);
		const root = container.querySelector(".MUI_Rating") as HTMLElement;
		expect(root.className).toMatch(/_error|error/);
	});

	test("renders custom icon and emptyIcon", () => {
		const { container } = renderWithTheme(
			<Rating
				name="r-icons"
				defaultValue={1}
				max={2}
				precision={1}
				icon={<span data-testid="filled-icon">★</span>}
				emptyIcon={<span data-testid="empty-icon">☆</span>}
				readOnly
			/>,
		);
		// One filled (value 1) and empty segments for remaining slots
		expect(container.querySelectorAll('[data-testid="filled-icon"]').length).toBeGreaterThan(
			0,
		);
		expect(container.querySelectorAll('[data-testid="empty-icon"]').length).toBeGreaterThan(
			0,
		);
	});

	test("sets colorOverRide CSS variable", () => {
		const { container } = renderWithTheme(
			<Rating
				name="r-override"
				defaultValue={2}
				colorOverRide="#9c27b0"
				readOnly
			/>,
		);
		const root = container.querySelector(".MUI_Rating") as HTMLElement;
		// useColorOverRide writes --color-override as "r, g, b"
		expect(root.style.getPropertyValue("--color-override")).toBeTruthy();
	});
});
