import { describe, expect, test } from "bun:test";
import Drawer from "../../mui/Drawer";
import { renderWithTheme } from "../helpers/render";

function overflowY() {
	return document.documentElement.style.overflowY;
}

describe("Drawer", () => {
	test("does not lock scroll when closed at mount", () => {
		renderWithTheme(<Drawer open={false}>nav</Drawer>);
		expect(overflowY()).not.toBe("hidden");
		expect(document.querySelector(".MUI_Drawer_Root")).toBeNull();
	});

	test("keepMounted closed does not lock scroll or open the backdrop", () => {
		renderWithTheme(
			<Drawer open={false} keepMounted>
				nav
			</Drawer>,
		);
		expect(overflowY()).not.toBe("hidden");
		expect(document.querySelector(".MUI_Backdrop_Root._opened")).toBeNull();
	});

	test("locks while a temporary drawer is open and restores on close", () => {
		const { rerender } = renderWithTheme(<Drawer open>nav</Drawer>);
		expect(overflowY()).toBe("hidden");
		rerender(<Drawer open={false}>nav</Drawer>);
		expect(overflowY()).not.toBe("hidden");
	});

	test("disableScrollLock skips the page lock", () => {
		renderWithTheme(
			<Drawer open disableScrollLock>
				nav
			</Drawer>,
		);
		expect(overflowY()).not.toBe("hidden");
	});

	test("permanent and persistent variants never lock", () => {
		const { rerender } = renderWithTheme(
			<Drawer variant="permanent" open>
				nav
			</Drawer>,
		);
		expect(overflowY()).not.toBe("hidden");
		rerender(
			<Drawer variant="persistent" open>
				nav
			</Drawer>,
		);
		expect(overflowY()).not.toBe("hidden");
	});

	test("stacked temporary drawers stay locked until the last one closes", () => {
		function Pair({ a, b }: { a: boolean; b: boolean }) {
			return (
				<>
					<Drawer open={a}>a</Drawer>
					<Drawer open={b}>b</Drawer>
				</>
			);
		}
		const { rerender } = renderWithTheme(<Pair a b />);
		expect(overflowY()).toBe("hidden");
		rerender(<Pair a={false} b />);
		expect(overflowY()).toBe("hidden");
		rerender(<Pair a={false} b={false} />);
		expect(overflowY()).not.toBe("hidden");
	});
});
