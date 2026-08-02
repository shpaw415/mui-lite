import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import Stepper, { Step, StepLabel, StepContent } from "../../mui/Stepper";

describe("Stepper", () => {
	test("horizontal steps", () => {
		renderWithTheme(
			<Stepper activeStep={1} data-testid="stepper">
				<Step>
					<StepLabel>Select</StepLabel>
				</Step>
				<Step>
					<StepLabel>Create</StepLabel>
				</Step>
				<Step>
					<StepLabel>Done</StepLabel>
				</Step>
			</Stepper>,
		);
		expect(screen.getByTestId("stepper").className).toContain("horizontal");
		expect(screen.getByText("Select")).toBeTruthy();
		expect(screen.getByText("Create")).toBeTruthy();
	});

	test("vertical shows StepContent when active", () => {
		renderWithTheme(
			<Stepper activeStep={0} orientation="vertical">
				<Step>
					<StepLabel>First</StepLabel>
					<StepContent>
						<div data-testid="content">details</div>
					</StepContent>
				</Step>
				<Step>
					<StepLabel>Second</StepLabel>
					<StepContent>hidden</StepContent>
				</Step>
			</Stepper>,
		);
		expect(screen.getByTestId("content")).toBeTruthy();
		expect(screen.queryByText("hidden")).toBeNull();
	});
});
