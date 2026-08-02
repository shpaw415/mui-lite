import { describe, expect, test, mock } from "bun:test";
import { renderWithTheme, screen, fireEvent } from "../helpers/render";
import Button, { ButtonGroup } from "../../mui/Button";

describe("Button", () => {
	test("renders children", () => {
		renderWithTheme(<Button>Click me</Button>);
		expect(screen.getByRole("button", { name: /click me/i })).toBeTruthy();
	});

	test("applies variant and color classes", () => {
		renderWithTheme(
			<Button variant="outlined" color="secondary">
				Save
			</Button>,
		);
		const btn = screen.getByRole("button", { name: /save/i });
		expect(btn.className).toContain("MUI_Button");
		expect(btn.className).toContain("outlined");
		expect(btn.className).toContain("secondary");
	});

	test("fires onClick", () => {
		const onClick = mock(() => {});
		renderWithTheme(<Button onClick={onClick}>Go</Button>);
		fireEvent.click(screen.getByRole("button", { name: /go/i }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	test("respects disabled", () => {
		const onClick = mock(() => {});
		renderWithTheme(
			<Button disabled onClick={onClick}>
				Nope
			</Button>,
		);
		const btn = screen.getByRole("button", { name: /nope/i }) as HTMLButtonElement;
		expect(btn.disabled).toBe(true);
	});

	test("fullWidth class", () => {
		renderWithTheme(<Button fullWidth>Wide</Button>);
		expect(screen.getByRole("button", { name: /wide/i }).className).toContain(
			"fullWidth",
		);
	});
});

describe("ButtonGroup", () => {
	test("renders group role", () => {
		renderWithTheme(
			<ButtonGroup>
				<Button>One</Button>
				<Button>Two</Button>
			</ButtonGroup>,
		);
		expect(screen.getByRole("group")).toBeTruthy();
	});
});
