import { describe, expect, test, mock } from "bun:test";
import { renderWithTheme, screen, fireEvent } from "../helpers/render";
import Tabs, { Tab } from "../../mui/Tabs";

describe("Tabs", () => {
	test("renders tablist and selects by value", () => {
		renderWithTheme(
			<Tabs value={1} data-testid="tabs">
				<Tab label="One" />
				<Tab label="Two" />
			</Tabs>,
		);
		expect(screen.getByRole("tablist")).toBeTruthy();
		const tabs = screen.getAllByRole("tab");
		expect(tabs.length).toBe(2);
		expect(tabs[1].getAttribute("aria-selected")).toBe("true");
	});

	test("onChange fires with index", () => {
		const onChange = mock(() => {});
		renderWithTheme(
			<Tabs value={0} onChange={onChange}>
				<Tab label="A" />
				<Tab label="B" />
			</Tabs>,
		);
		fireEvent.click(screen.getByRole("tab", { name: "B" }));
		expect(onChange).toHaveBeenCalled();
		expect(onChange.mock.calls[0][1]).toBe(1);
	});
});
