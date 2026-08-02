import { describe, expect, test } from "bun:test";
import ToolTip from "../../mui/ToolTip";
import Button from "../../mui/Button";
import { fireEvent, renderWithTheme, screen } from "../helpers/render";

describe("ToolTip portal", () => {
	test("tip is not a descendant of overflow container", async () => {
		const { container } = renderWithTheme(
			<div style={{ overflow: "hidden", height: 40 }} data-testid="clip">
				<ToolTip title="Hello tip" open>
					<button type="button">Anchor</button>
				</ToolTip>
			</div>,
		);
		const tip = document.querySelector('[role="tooltip"]');
		expect(tip).toBeTruthy();
		const clip = screen.getByTestId("clip");
		expect(clip.contains(tip)).toBe(false);
		expect(tip?.className.includes("MUI_Tooltip-Tip_portal") || tip?.className.includes("Tooltip-Tip")).toBe(true);
	});
});
