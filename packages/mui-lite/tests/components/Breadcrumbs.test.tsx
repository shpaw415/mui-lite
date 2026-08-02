import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen, fireEvent } from "../helpers/render";
import Breadcrumbs from "../../mui/Breadcrumbs";
import Link from "../../mui/Link";

describe("Breadcrumbs", () => {
	test("renders items with separators", () => {
		renderWithTheme(
			<Breadcrumbs data-testid="bc">
				<Link href="/">Home</Link>
				<Link href="/docs">Docs</Link>
				<span>Current</span>
			</Breadcrumbs>,
		);
		expect(screen.getByTestId("bc").getAttribute("aria-label")).toBe(
			"breadcrumb",
		);
		expect(screen.getByText("Home")).toBeTruthy();
		expect(screen.getByText("Current")).toBeTruthy();
		expect(screen.getAllByText("/").length).toBeGreaterThanOrEqual(1);
	});

	test("collapses when maxItems exceeded", () => {
		renderWithTheme(
			<Breadcrumbs maxItems={2} itemsBeforeCollapse={1} itemsAfterCollapse={1}>
				<span>A</span>
				<span>B</span>
				<span>C</span>
				<span>D</span>
			</Breadcrumbs>,
		);
		expect(screen.getByLabelText("Show path")).toBeTruthy();
		expect(screen.queryByText("B")).toBeNull();
		fireEvent.click(screen.getByLabelText("Show path"));
		expect(screen.getByText("B")).toBeTruthy();
	});
});
