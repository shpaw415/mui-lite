import { describe, expect, test } from "bun:test";
import AutoComplete from "../../mui/AutoComplete";
import { fireEvent, renderWithTheme } from "../helpers/render";

function getInput() {
	return document.querySelector(".MUI_TextField_Input") as HTMLInputElement;
}

describe("AutoComplete", () => {
	test("does not crash on mount when value matches an option (issue #7)", () => {
		renderWithTheme(
			<AutoComplete
				value="France"
				options={[{ label: "France" }, { label: "Germany" }]}
				onSelect={() => {}}
			/>,
		);
		expect(getInput().value).toBe("France");
	});

	test("list buttons carry SlotProps.input.id so pseudo-scroll can find them", () => {
		renderWithTheme(
			<AutoComplete
				SlotProps={{ input: { id: "ob-provider-ac" } }}
				options={["Alpha", "Beta", "Gamma"]}
			/>,
		);
		const input = getInput();
		fireEvent.focus(input);

		const first = document.querySelector(
			'button[index-data="0"].ob-provider-ac',
		);
		expect(first).toBeTruthy();

		fireEvent.keyDown(input, { key: "ArrowDown" });
		expect(
			document
				.querySelector('button[index-data="0"].ob-provider-ac')
				?.className.includes("pseudo_selected"),
		).toBe(true);

		fireEvent.keyDown(input, { key: "ArrowDown" });
		expect(
			document
				.querySelector('button[index-data="1"].ob-provider-ac')
				?.className.includes("pseudo_selected"),
		).toBe(true);
	});

	test("keyboard navigation does not throw before the generated id exists", () => {
		renderWithTheme(<AutoComplete options={["Alpha", "Beta"]} />);
		const input = getInput();
		fireEvent.focus(input);
		expect(() => fireEvent.keyDown(input, { key: "ArrowDown" })).not.toThrow();
		expect(
			document
				.querySelector('button[index-data="0"]')
				?.className.includes("pseudo_selected"),
		).toBe(true);
	});
});
