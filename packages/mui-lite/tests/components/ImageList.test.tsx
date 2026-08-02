import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import ImageList, {
	ImageListItem,
	ImageListItemBar,
} from "../../mui/ImageList";

describe("ImageList", () => {
	test("renders items and bar", () => {
		renderWithTheme(
			<ImageList cols={2} rowHeight={100} data-testid="list">
				<ImageListItem>
					<img src="/a.jpg" alt="A" />
					<ImageListItemBar title="Title A" subtitle="sub" />
				</ImageListItem>
				<ImageListItem>
					<img src="/b.jpg" alt="B" />
				</ImageListItem>
			</ImageList>,
		);
		expect(screen.getByTestId("list").className).toContain("ImageList");
		expect(screen.getByAltText("A")).toBeTruthy();
		expect(screen.getByText("Title A")).toBeTruthy();
		expect(screen.getByText("sub")).toBeTruthy();
	});
});
