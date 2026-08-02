import { describe, expect, test, mock } from "bun:test";
import { renderWithTheme, screen, fireEvent } from "../helpers/render";
import FormControl from "../../mui/FormControl";
import FormLabel from "../../mui/FormLabel";
import FormHelperText from "../../mui/FormHelperText";
import FormGroup from "../../mui/FormGroup";
import FormControlLabel from "../../mui/FormControlLabel";
import InputLabel from "../../mui/InputLabel";
import InputAdornment from "../../mui/InputAdornment";
import Input, { OutlinedInput, FilledInput } from "../../mui/Input";
import NativeSelect from "../../mui/NativeSelect";
import CheckBox from "../../mui/CheckBox";

describe("FormControl composition", () => {
	test("wires label, input, helper via context", () => {
		renderWithTheme(
			<FormControl error>
				<InputLabel>Email</InputLabel>
				<OutlinedInput data-testid="input-root" defaultValue="" />
				<FormHelperText>Required field</FormHelperText>
			</FormControl>,
		);
		expect(screen.getByText("Email")).toBeTruthy();
		expect(screen.getByText("Required field").className).toContain("error");
		expect(screen.getByTestId("input-root").className).toContain("error");
	});

	test("fullWidth class", () => {
		renderWithTheme(
			<FormControl fullWidth data-testid="fc">
				<Input />
			</FormControl>,
		);
		expect(screen.getByTestId("fc").className).toContain("fullWidth");
	});
});

describe("FormControlLabel", () => {
	test("renders control with label", () => {
		renderWithTheme(
			<FormControlLabel control={<CheckBox />} label="Accept" />,
		);
		expect(screen.getByText("Accept")).toBeTruthy();
	});

	test("fires onChange", () => {
		const onChange = mock(() => {});
		renderWithTheme(
			<FormControlLabel
				control={<CheckBox />}
				label="X"
				onChange={onChange}
			/>,
		);
		const input = document.querySelector(
			'input[type="checkbox"]',
		) as HTMLInputElement;
		fireEvent.click(input);
		expect(onChange).toHaveBeenCalled();
	});
});

describe("FormGroup", () => {
	test("row class", () => {
		renderWithTheme(
			<FormGroup row data-testid="fg">
				<span>a</span>
			</FormGroup>,
		);
		expect(screen.getByTestId("fg").className).toContain("row");
	});
});

describe("Input variants", () => {
	test("standard Input", () => {
		renderWithTheme(<Input data-testid="i" placeholder="name" />);
		expect(screen.getByTestId("i").className).toContain("variant-standard");
		expect(screen.getByPlaceholderText("name")).toBeTruthy();
	});

	test("OutlinedInput and FilledInput", () => {
		const { rerender } = renderWithTheme(
			<OutlinedInput data-testid="o" />,
		);
		expect(screen.getByTestId("o").className).toContain("variant-outlined");
		rerender(
			// need theme wrapper again via renderWithTheme
			<></>,
		);
	});

	test("FilledInput class", () => {
		renderWithTheme(<FilledInput data-testid="f" />);
		expect(screen.getByTestId("f").className).toContain("variant-filled");
	});

	test("adornments render", () => {
		renderWithTheme(
			<OutlinedInput
				startAdornment={
					<InputAdornment position="start">$</InputAdornment>
				}
				endAdornment={<InputAdornment position="end">kg</InputAdornment>}
				data-testid="a"
			/>,
		);
		expect(screen.getByText("$")).toBeTruthy();
		expect(screen.getByText("kg")).toBeTruthy();
	});
});

describe("NativeSelect", () => {
	test("renders options", () => {
		renderWithTheme(
			<NativeSelect data-testid="ns" defaultValue="a">
				<option value="a">A</option>
				<option value="b">B</option>
			</NativeSelect>,
		);
		const select = screen.getByTestId("ns").querySelector("select");
		expect(select).toBeTruthy();
		expect(select?.querySelectorAll("option").length).toBe(2);
	});
});

describe("FormLabel", () => {
	test("shows required asterisk", () => {
		renderWithTheme(<FormLabel required>Name</FormLabel>);
		expect(screen.getByText("*")).toBeTruthy();
	});
});
