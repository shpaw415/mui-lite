import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import Card, {
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
} from "../../mui/Card";

describe("Card", () => {
	test("renders composition", () => {
		renderWithTheme(
			<Card data-testid="card">
				<CardHeader title="Title" subheader="Sub" />
				<CardMedia image="/img.png" style={{ height: 100 }} data-testid="media" />
				<CardContent>Body</CardContent>
				<CardActions>
					<button type="button">Action</button>
				</CardActions>
			</Card>,
		);
		expect(screen.getByTestId("card").className).toContain("Card");
		expect(screen.getByText("Title")).toBeTruthy();
		expect(screen.getByText("Sub")).toBeTruthy();
		expect(screen.getByText("Body")).toBeTruthy();
		expect(screen.getByTestId("media")).toBeTruthy();
		expect(screen.getByRole("button", { name: /action/i })).toBeTruthy();
	});

	test("raised increases elevation class path", () => {
		renderWithTheme(
			<Card raised data-testid="card">
				hi
			</Card>,
		);
		expect(screen.getByTestId("card").className).toContain("raised");
	});
});
