import { describe, expect, test, mock } from "bun:test";
import { renderWithTheme, screen, fireEvent } from "../helpers/render";
import ButtonBase from "../../mui/ButtonBase";

describe("ButtonBase", () => {
	test("renders as button", () => {
		renderWithTheme(<ButtonBase>Base</ButtonBase>);
		expect(screen.getByRole("button", { name: /base/i })).toBeTruthy();
	});

	test("disabled prevents click", () => {
		const onClick = mock(() => {});
		renderWithTheme(
			<ButtonBase disabled onClick={onClick}>
				X
			</ButtonBase>,
		);
		fireEvent.click(screen.getByRole("button", { name: /^x$/i }));
		expect(onClick).not.toHaveBeenCalled();
	});

	test("href renders anchor", () => {
		renderWithTheme(
			<ButtonBase href="/path" data-testid="link">
				Link
			</ButtonBase>,
		);
		const el = screen.getByTestId("link");
		expect(el.tagName.toLowerCase()).toBe("a");
		expect(el.getAttribute("href")).toBe("/path");
	});
});
