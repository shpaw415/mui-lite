import { useClassNames, useStyle, type SxProps } from "../../common/theme";
import TextField, { type TextFieldProps } from "../TextField";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import ArrowDown from "@material-design-icons/svg/filled/arrow_drop_down.svg";
import { List, ListItem } from "../List";
import Box from "../Box";
import { type JSX } from "react";
import { useMuiRef } from "@/common/utils";

export type SelectProps = {
  value?: string;
  name: string;
  onSelect?: (value: string, option: JSX.Element) => void;
  defaultValue?: string;
  children: JSX.Element[] | JSX.Element;
  dropDownSx?: SxProps;
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
  dropDownSx,
  formatName,
  ...props
}: SelectProps) {
  if (!Array.isArray(children)) children = [children] as any;
  const _style = useStyle(sx);
  const DefaultValueMemo = useMemo(() => {
    if (defaultValue) {
      let val = (children as JSX.Element[]).find(
        (e) => e.props?.value == defaultValue
      )?.props.children as undefined | string;
      if (val && formatName) val = formatName(val);
      return val ? val : "";
    }
    return "";
  }, [defaultValue]);
  const ref = useMuiRef(props.ref);
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
  });

  const select = useClassNames({
    component_name: "Select_Input",
  });

  const OnSelectHandler = useCallback(
    onSelect
      ? (child: JSX.Element, index: number) => {
          onSelect(child.props?.value || index, child.props?.children);
          if (!value) {
            setDisplayedValue(
              formatName
                ? formatName(child.props?.children)
                : child.props?.children
            );
            setValue(child.props?.value);
          }
        }
      : (child: JSX.Element, index: number) => {
          const newValue = child.props?.value as string;
          setDisplayedValue(
            formatName
              ? formatName(child.props?.children)
              : child.props?.children
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
        ref={ref}
      />
      <Box className={dropDown.combined} sx={dropDownSx}>
        <List className="overflow-auto" disablePadding>
          {(children as Array<JSX.Element>).map((child, index) => {
            return (
              <ListItem
                e-value={child.props.value}
                key={index}
                onClick={(ev) => {
                  OnSelectHandler(child, index);
                  ref.current?.blur();
                }}
                className={
                  (displayedValue || DefaultValueMemo) == child.props?.value
                    ? "selected"
                    : ""
                }
              >
                {child?.props?.children || ""}
              </ListItem>
            );
          })}
        </List>
      </Box>
    </div>
  );
}

export default Select;
