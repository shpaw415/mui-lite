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

	test("scrollable tabs pan horizontally on wheel", () => {
		renderWithTheme(
			<Tabs value={0} variant="scrollable">
				<Tab label="A" />
				<Tab label="B" />
				<Tab label="C" />
			</Tabs>,
		);
		const scroller = document.querySelector(".MUI_Tabs_scroller") as HTMLElement;
		Object.defineProperty(scroller, "scrollWidth", { configurable: true, value: 1200 });
		Object.defineProperty(scroller, "clientWidth", { configurable: true, value: 400 });
		let scrollLeft = 0;
		Object.defineProperty(scroller, "scrollLeft", {
			configurable: true,
			get: () => scrollLeft,
			set: (v: number) => {
				scrollLeft = v;
			},
		});

		// wheel over the strip pans it (preventDefault → canceled → false)
		const panned = fireEvent.wheel(scroller, { deltaY: 120, cancelable: true });
		expect(panned).toBe(false);
		expect(scrollLeft).toBe(120);

		// at the far end the wheel bubbles to the page
		scrollLeft = 800;
		const bubbled = fireEvent.wheel(scroller, { deltaY: 120, cancelable: true });
		expect(bubbled).toBe(true);
		expect(scrollLeft).toBe(800);
	});

	test("wheel is ignored when the strip does not overflow", () => {
		renderWithTheme(
			<Tabs value={0} variant="scrollable">
				<Tab label="A" />
				<Tab label="B" />
			</Tabs>,
		);
		const scroller = document.querySelector(".MUI_Tabs_scroller") as HTMLElement;
		const notHandled = fireEvent.wheel(scroller, { deltaY: 120, cancelable: true });
		expect(notHandled).toBe(true);
	});

	test("fixed tabs do not handle wheel", () => {
		renderWithTheme(
			<Tabs value={0}>
				<Tab label="A" />
				<Tab label="B" />
			</Tabs>,
		);
		const scroller = document.querySelector(".MUI_Tabs_scroller") as HTMLElement;
		Object.defineProperty(scroller, "scrollWidth", { configurable: true, value: 1200 });
		Object.defineProperty(scroller, "clientWidth", { configurable: true, value: 400 });
		const notHandled = fireEvent.wheel(scroller, { deltaY: 120, cancelable: true });
		expect(notHandled).toBe(true);
	});
});
