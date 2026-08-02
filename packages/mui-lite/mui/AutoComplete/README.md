Collecting workspace informationFiltering to most relevant informationHere is a simplified and user-focused documentation for the `AutoComplete` component, excluding internal implementation details:

```markdown
# AutoComplete Component

The `AutoComplete` component is a customizable and reusable React component that provides an autocomplete input field with dropdown options. It supports filtering, custom rendering, and keyboard navigation.

---

## Table of Contents

- [Usage](#usage)
- [Props](#props)
- [Keyboard Navigation](#keyboard-navigation)
- [Customizations](#customizations)
- [Example](#example)

---

## Usage

To use the `AutoComplete` component, import it into your React project and provide the required props.

```javascript XML
import AutoComplete from "@bunpmjs/mui-lite/AutoComplete";

<AutoComplete
  options={["Option 1", "Option 2", "Option 3"]}
  onSelect={(value) => console.log("Selected:", value)}
  onChange={(e) => console.log("Input changed:", e.currentTarget.value)}
/>;
```

---

## Props

### `AutoCompleteProps`

The `AutoComplete` component accepts the following props:

| Prop Name        | Type                                                                                                               | Description                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `SlotProps`      | `SlotProps<{ input?: TextFieldProps; dropdown?: MenuProps; list?: ListProps; listButton?: ListItemButtonProps; }>` | Custom props for internal components like input, dropdown, list, and list buttons. |
| `options`        | `OptionsTypes<string>`                                                                                             | The list of options to display in the dropdown.                                    |
| `onSelect`       | `(value: Values[number]) => void`                                                                                  | Callback triggered when an option is selected.                                     |
| `onChange`       | `React.FormEventHandler<HTMLInputElement>`                                                                         | Callback triggered when the input value changes.                                   |
| `listItemRender` | `(value: ValueType<Values>[number]) => JSX.Element \| JSX.Element[]`                                               | Custom Element inside the ListButton                                               | Custom renderer for list items. |
| `onFilter`       | `(option: ValueType<Values>[number], inputValue: string) => boolean`                                               | Custom filter function for options.                                                |
| `formatSelect`   | `(option: ValueType<Values>[number], inputValue: string) => boolean`                                               | Custom function to determine if an option is selected.                             |
| `formatInput`    | `(option: ValueType<Values>[number]) => string`                                                                    | Custom function to format the input value when an option is selected.              |
| `value`          | `string`                                                                                                           | The current value of the input field.                                              |

---

## Keyboard Navigation

The `AutoComplete` component supports the following keyboard interactions:

- **ArrowUp**: Moves the selection up in the dropdown.
- **ArrowDown**: Moves the selection down in the dropdown.
- **Enter**: Selects the currently highlighted option.
- **Blur**: Resets the pseudo-selection when the input loses focus.

---

## Customizations

### SlotProps

You can customize the internal components using the `SlotProps` prop. For example:

- `input`: Customize the input field.
- `dropdown`: Customize the dropdown menu.
- `list`: Customize the list container.
- `listButton`: Customize the list item buttons.

### Custom Renderers

You can provide a custom renderer for list items using the `listItemRender` prop.

---

## Example

Here is a complete example of the `AutoComplete` component:

```javascript XML
import AutoComplete from "@bunpmjs/mui-lite/AutoComplete";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

function App() {
  return (
    <AutoComplete
      options={options}
      onSelect={(value) => console.log("Selected:", value)}
      onChange={(e) => console.log("Input changed:", e.currentTarget.value)}
      listItemRender={(option) => <span>{option.label}</span>}
      onFilter={(option, inputValue) =>
        option.value.includes(inputValue.toLowerCase())
      }
    />
  );
}

export default App;
```

---

## Notes

- Ensure that the `options` prop is either an array of strings or objects with a `label` property.
- The component is designed to be fully customizable and reusable across different projects.
```