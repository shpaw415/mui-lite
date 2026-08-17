import { describe, expect, mock, test } from "bun:test";
import { useRef } from "react";
import Menu from "../../mui/Menu";
import { act, renderWithTheme, screen } from "../helpers/render";

function OpenMenu({
	onClose,
	closeOnScroll,
}: {
	onClose: () => void;
	closeOnScroll?: boolean;
}) {
	const anchorRef = useRef<HTMLButtonElement>(null);
	return (
		<>
			<button type="button" ref={anchorRef}>
				Open
			</button>
			<Menu
				open
				anchorEl={anchorRef}
				onClose={onClose}
				closeOnScroll={closeOnScroll}
			>
				<div data-testid="menu-body">item</div>
			</Menu>
		</>
	);
}

describe("Menu", () => {
	test("does not render when closed", () => {
		const anchor = { current: document.createElement("button") };
		renderWithTheme(
			<Menu open={false} anchorEl={anchor}>
				<div data-testid="menu-closed">x</div>
			</Menu>,
		);
		expect(screen.queryByTestId("menu-closed")).toBeNull();
	});

	test("does not close when scrolling inside the menu", () => {
		const onClose = mock(() => {});
		renderWithTheme(<OpenMenu onClose={onClose} />);
		const menu = document.querySelector(".MUI_Menu_Root") as HTMLElement;
		expect(menu).toBeTruthy();
		act(() => {
			menu.dispatchEvent(new Event("scroll", { bubbles: true }));
		});
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId("menu-body")).toBeTruthy();
	});

	test("does not close when page scroll-chains from a menu wheel", () => {
		const onClose = mock(() => {});
		renderWithTheme(<OpenMenu onClose={onClose} />);
		const menu = document.querySelector(".MUI_Menu_Root") as HTMLElement;
		act(() => {
			menu.dispatchEvent(
				new WheelEvent("wheel", { bubbles: true, deltaY: 40 }),
			);
			document.dispatchEvent(new Event("scroll", { bubbles: true }));
		});
		expect(onClose).not.toHaveBeenCalled();
	});

	test("closes when the page scrolls", () => {
		const onClose = mock(() => {});
		renderWithTheme(<OpenMenu onClose={onClose} />);
		act(() => {
			document.dispatchEvent(new Event("scroll", { bubbles: true }));
		});
		expect(onClose).toHaveBeenCalled();
	});

	test("repositions instead of closing when closeOnScroll is false", () => {
		const onClose = mock(() => {});
		renderWithTheme(<OpenMenu onClose={onClose} closeOnScroll={false} />);
		act(() => {
			document.dispatchEvent(new Event("scroll", { bubbles: true }));
		});
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId("menu-body")).toBeTruthy();
	});
});
