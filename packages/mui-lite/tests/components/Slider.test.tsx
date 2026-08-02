import { describe, expect, test } from "bun:test";
import Slider from "../../mui/Slider";
import { fireEvent, renderWithTheme, screen } from "../helpers/render";

describe("Slider", () => {
	test("renders a thumb for defaultValue", () => {
		renderWithTheme(<Slider defaultValue={30} min={0} max={100} />);
		const thumb = screen.getByRole("slider");
		expect(thumb.getAttribute("aria-valuenow")).toBe("30");
		expect(thumb.style.left).toBe("30%");
	});

	test("range renders two thumbs ordered", () => {
		renderWithTheme(<Slider defaultValue={[20, 80]} />);
		const thumbs = screen.getAllByRole("slider");
		expect(thumbs.length).toBe(2);
		expect(thumbs[0].getAttribute("aria-valuenow")).toBe("20");
		expect(thumbs[1].getAttribute("aria-valuenow")).toBe("80");
		expect(thumbs[0].style.left).toBe("20%");
		expect(thumbs[1].style.left).toBe("80%");
	});

	test("keyboard arrows change value", () => {
		const values: number[][] = [];
		renderWithTheme(
			<Slider
				defaultValue={50}
				step={5}
				onChange={(v) => values.push(v)}
			/>,
		);
		const thumb = screen.getByRole("slider");
		fireEvent.keyDown(thumb, { key: "ArrowRight" });
		expect(thumb.getAttribute("aria-valuenow")).toBe("55");
		expect(values.at(-1)).toEqual([55]);
		fireEvent.keyDown(thumb, { key: "ArrowLeft" });
		expect(thumb.getAttribute("aria-valuenow")).toBe("50");
	});

	test("maps clientX to value via pointer on track", () => {
		const { container } = renderWithTheme(
			<div style={{ width: 200 }}>
				<Slider defaultValue={0} min={0} max={100} />
			</div>,
		);
		const root = container.querySelector(".MUI_Slider_Root") as HTMLElement;
		// Mock geometry: left=0, width=200 → clientX=100 → 50%
		root.getBoundingClientRect = () =>
			({
				left: 0,
				width: 200,
				top: 0,
				height: 30,
				right: 200,
				bottom: 30,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}) as DOMRect;

		fireEvent.pointerDown(root, { clientX: 100, button: 0, pointerId: 1 });
		const thumb = screen.getByRole("slider");
		expect(thumb.getAttribute("aria-valuenow")).toBe("50");
		expect(thumb.style.left).toBe("50%");
	});
});
