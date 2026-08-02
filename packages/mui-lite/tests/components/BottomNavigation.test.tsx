import { describe, expect, test, mock } from "bun:test";
import { renderWithTheme, screen, fireEvent } from "../helpers/render";
import BottomNavigation, {
	BottomNavigationAction,
} from "../../mui/BottomNavigation";

describe("BottomNavigation", () => {
	test("selects and fires onChange", () => {
		const onChange = mock(() => {});
		renderWithTheme(
			<BottomNavigation value={0} onChange={onChange} showLabels>
				<BottomNavigationAction label="Recents" icon={<span>R</span>} />
				<BottomNavigationAction label="Favorites" icon={<span>F</span>} />
			</BottomNavigation>,
		);
		expect(screen.getByText("Recents")).toBeTruthy();
		fireEvent.click(screen.getByText("Favorites").closest("button")!);
		expect(onChange).toHaveBeenCalled();
		expect(onChange.mock.calls[0][1]).toBe(1);
	});
});
