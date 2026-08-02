import { describe, expect, test, mock } from "bun:test";
import { renderWithTheme, screen, fireEvent } from "../helpers/render";
import Rating from "../../mui/Rating";

describe("Rating", () => {
	test("renders max icons", () => {
		renderWithTheme(<Rating defaultValue={2} max={5} name="r1" />);
		const radios = document.querySelectorAll('input[type="radio"]');
		expect(radios.length).toBe(5);
	});

	test("onChange", () => {
		const onChange = mock(() => {});
		renderWithTheme(
			<Rating value={1} onChange={onChange} name="r2" max={3} />,
		);
		const radios = document.querySelectorAll(
			'input[name="r2"]',
		) as NodeListOf<HTMLInputElement>;
		fireEvent.click(radios[2]);
		expect(onChange).toHaveBeenCalled();
	});

	test("readOnly exposes img role", () => {
		renderWithTheme(<Rating value={3} readOnly name="r3" />);
		expect(screen.getByRole("img")).toBeTruthy();
	});
});
