import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import MobileStepper from "../../mui/MobileStepper";
import Button from "../../mui/Button";

describe("MobileStepper", () => {
	test("dots variant", () => {
		renderWithTheme(
			<MobileStepper
				steps={4}
				activeStep={1}
				position="static"
				variant="dots"
				data-testid="ms"
				backButton={<Button>Back</Button>}
				nextButton={<Button>Next</Button>}
			/>,
		);
		expect(screen.getByTestId("ms").className).toContain("MobileStepper");
		expect(document.querySelectorAll(".MUI_MobileStepper_dot").length).toBe(4);
		expect(
			document.querySelectorAll(".MUI_MobileStepper_dot_active").length,
		).toBe(1);
	});

	test("text variant", () => {
		renderWithTheme(
			<MobileStepper steps={3} activeStep={1} variant="text" position="static" />,
		);
		expect(screen.getByText("2 / 3")).toBeTruthy();
	});
});
