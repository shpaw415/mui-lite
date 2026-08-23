import { describe, expect, test } from "bun:test";
import { usePreventScroll } from "../../common/utils";
import { cleanup, renderWithTheme } from "../helpers/render";

function Probe({ active }: { active: boolean }) {
	usePreventScroll(active);
	return null;
}

function overflowY() {
	return document.documentElement.style.overflowY;
}

describe("usePreventScroll", () => {
	test("does not lock when inactive at mount", () => {
		renderWithTheme(<Probe active={false} />);
		expect(overflowY()).not.toBe("hidden");
	});

	test("locks only while active", () => {
		const { rerender } = renderWithTheme(<Probe active />);
		expect(overflowY()).toBe("hidden");
		rerender(<Probe active={false} />);
		expect(overflowY()).not.toBe("hidden");
	});

	test("keeps lock while any stacked instance is active", () => {
		function Pair({ a, b }: { a: boolean; b: boolean }) {
			return (
				<>
					<Probe active={a} />
					<Probe active={b} />
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

	test("unlocks on unmount", () => {
		renderWithTheme(<Probe active />);
		expect(overflowY()).toBe("hidden");
		cleanup();
		expect(overflowY()).not.toBe("hidden");
	});
});
