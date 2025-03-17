import { useClassNames, useStyle, type SxProps } from "../../common/theme";
import TextField, { type TextFieldProps } from "../TextField";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type RefObject,
} from "react";
import ArrowDown from "@material-design-icons/svg/filled/arrow_drop_down.svg";
import { List, ListItemButton, ListItemText, type ListProps } from "../List";
import Box, { type BoxProps } from "../Box";
import { type JSX } from "react";
import { type SlotProps } from "../../common/utils";

export type SelectProps = {
  value?: string;
  name: string;
  onSelect?: (value: string, option: JSX.Element) => void;
  defaultValue?: string;
  children: JSX.Element[] | JSX.Element;
  SlotProps?: SlotProps<{
    "dropdown-wrapper": BoxProps<HTMLDivElement>;
    "dropdown-list": ListProps;
  }>;
  formatName?: (value: string | JSX.Element) => string;
  sx?: SxProps;
  ref?: RefObject<HTMLInputElement>;
} & Omit<TextFieldProps, "value" | "onSelect">;

function Select({
  sx,
  className,
  value,
  defaultValue,
  children,
  onSelect,
  SlotProps,
  formatName,
  ...props
}: SelectProps) {
  if (!Array.isArray(children)) children = [children] as any;
  const _style = useStyle(sx);
  const DefaultValueMemo = useMemo(() => {
    if (defaultValue) {
      let val = (children as JSX.Element[]).find(
        (e) => e.props?.value == defaultValue
      ) as undefined | string;
      if (val && formatName) val = formatName(val);
      return val ? val : "";
    }
    return "";
  }, [defaultValue]);
  const [_value, setValue] = useState(defaultValue || "");
  const [displayedValue, setDisplayedValue] =
    useState<string>(DefaultValueMemo);
  useEffect(() => {
    setDisplayedValue(DefaultValueMemo);
  }, [defaultValue]);

  const root = useClassNames({
    component_name: "Select_Root",
    className,
  });

  const dropDown = useClassNames({
    component_name: "Select_DropDown_Root",
    className: SlotProps?.["dropdown-wrapper"]?.className,
  });

  const select = useClassNames({
    component_name: "Select_Input",
  });

  const OnSelectHandler = useCallback(
    onSelect
      ? (child: JSX.Element, index: number) => {
          onSelect(child.props?.value || index, child);
          if (!value) {
            setDisplayedValue(
              formatName ? formatName(child) : child.props?.children
            );
            setValue(child.props?.value);
          }
        }
      : (child: JSX.Element, index: number) => {
          const newValue = child.props?.value as string;
          setDisplayedValue(
            formatName ? formatName(child) : child.props?.children
          );
          setValue(newValue);
        },
    [onSelect]
  );

  if (value && _value != value) {
    setValue(value);
    setDisplayedValue(() => {
      for (const child of children as JSX.Element[]) {
        if (child.props?.value != value) continue;
        return child.props?.children;
      }
    });
  }

  return (
    <div style={_style.styleFromSx} className={root.combined}>
      <TextField
        value={displayedValue || DefaultValueMemo}
        endIcon={<ArrowDown className="MUI_Select_DropDown_Arrow" />}
        className={select.combined}
        sx={sx}
        readOnly
        {...props}
      />
      <Box {...SlotProps?.["dropdown-wrapper"]} className={dropDown.combined}>
        <List
          {...SlotProps?.["dropdown-list"]}
          className={[
            "overflow-auto",
            SlotProps?.["dropdown-list"]?.className,
          ].join(" ")}
          disablePadding
        >
          {(children as Array<JSX.Element>).map((child, index) => {
            return (
              <ListItemButton
                e-value={child.props.value}
                key={index}
                onClick={(ev) => {
                  OnSelectHandler(child, index);
                  ev.currentTarget.blur();
                }}
                className={
                  (displayedValue || DefaultValueMemo) == child.props?.value
                    ? "selected"
                    : ""
                }
              >
                {typeof child.props.children == "string" ? (
                  <ListItemText primary={child?.props?.children} />
                ) : (
                  child?.props?.children
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </div>
  );
}

export default Select;
