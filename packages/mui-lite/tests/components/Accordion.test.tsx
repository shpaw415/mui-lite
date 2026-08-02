import { describe, expect, test } from "bun:test";
import Accordion, {
	AccordionDetails,
	AccordionSummary,
} from "../../mui/Accordion";
import { fireEvent, renderWithTheme, screen } from "../helpers/render";

describe("Accordion", () => {
	test("renders summary and collapsed body by default", () => {
		renderWithTheme(
			<Accordion Summary={<AccordionSummary>Title</AccordionSummary>}>
				<AccordionDetails>Hidden body</AccordionDetails>
			</Accordion>,
		);
		expect(screen.getByText("Title")).toBeTruthy();
		expect(screen.getByText("Hidden body")).toBeTruthy();
		const root = document.querySelector("[class*='Accordion_Root']");
		expect(root).toBeTruthy();
		expect(root!.className.includes("_expended")).toBe(false);
	});

	test("expands on summary click", () => {
		renderWithTheme(
			<Accordion Summary={<AccordionSummary>Title</AccordionSummary>}>
				<AccordionDetails>Body</AccordionDetails>
			</Accordion>,
		);
		const btn = screen.getByRole("button", { name: /Title/i });
		expect(btn.getAttribute("aria-expanded")).toBe("false");
		fireEvent.click(btn);
		expect(btn.getAttribute("aria-expanded")).toBe("true");
		const root = document.querySelector("[class*='Accordion_Root']");
		expect(root).toBeTruthy();
		expect(root!.className.includes("_expended")).toBe(true);
	});

	test("defaultExpended starts open", () => {
		renderWithTheme(
			<Accordion
				defaultExpended
				Summary={<AccordionSummary>Open</AccordionSummary>}
			>
				<AccordionDetails>Shown</AccordionDetails>
			</Accordion>,
		);
		expect(
			screen.getByRole("button", { name: /Open/i }).getAttribute("aria-expanded"),
		).toBe("true");
	});

	test("supports children AccordionSummary without Summary prop", () => {
		renderWithTheme(
			<Accordion>
				<AccordionSummary>Child summary</AccordionSummary>
				<AccordionDetails>Child body</AccordionDetails>
			</Accordion>,
		);
		expect(screen.getByText("Child summary")).toBeTruthy();
		expect(screen.getByText("Child body")).toBeTruthy();
	});
});
