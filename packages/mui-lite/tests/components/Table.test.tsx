import { describe, expect, test } from "bun:test";
import { renderWithTheme, screen } from "../helpers/render";
import Table, {
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
} from "../../mui/Table";

describe("Table", () => {
	test("renders structure", () => {
		renderWithTheme(
			<TableContainer>
				<Table data-testid="table">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align="right">
								<TableSortLabel active direction="asc">
									Calories
								</TableSortLabel>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow hover>
							<TableCell>Cupcake</TableCell>
							<TableCell align="right">305</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>,
		);
		expect(screen.getByTestId("table").tagName.toLowerCase()).toBe("table");
		expect(screen.getByText("Name").tagName.toLowerCase()).toBe("th");
		expect(screen.getByText("Cupcake")).toBeTruthy();
		expect(screen.getByText("Calories")).toBeTruthy();
	});
});
