import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import Box from "../../mui/Box";

describe("Box", () => {
	test("renders as div by default", () => {
		renderWithTheme(
			<Box data-testid="box">
				content
			</Box>,
		);
		const el = screen.getByTestId("box");
		expect(el.tagName.toLowerCase()).toBe("div");
		expect(el.textContent).toBe("content");
	});

	test("polymorphic Element prop", () => {
		renderWithTheme(
			<Box Element="section" data-testid="sec">
				sec
			</Box>,
		);
		expect(screen.getByTestId("sec").tagName.toLowerCase()).toBe("section");
	});

	test("applies spacing and color from sx", () => {
		renderWithTheme(
			<Box data-testid="box" sx={{ p: 2, color: "primary.main" }}>
				x
			</Box>,
		);
		const el = screen.getByTestId("box") as HTMLElement;
		expect(el.style.padding).toBe("16px");
		expect(el.style.color).toBeTruthy();
	});

	test("applies className for pseudo sx", () => {
		renderWithTheme(
			<Box data-testid="box" sx={{ "&:hover": { color: "red" } }}>
				x
			</Box>,
		);
		const el = screen.getByTestId("box") as HTMLElement;
		expect(el.className).toMatch(/ml-sx-/);
	});

	test("responsive flexDirection stays off inline style", () => {
		renderWithTheme(
			<Box
				data-testid="box"
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
				}}
			>
				x
			</Box>,
		);
		const el = screen.getByTestId("box") as HTMLElement;
		expect(el.className).toMatch(/ml-sx-/);
		expect(el.style.flexDirection).toBe("");
		expect(el.style.display).toBe("flex");
		const css = document.querySelector("style[data-mui-lite-sx]")?.textContent ?? "";
		expect(css.indexOf("flex-direction:column")).toBeLessThan(
			css.indexOf("flex-direction:row"),
		);
	});
});
