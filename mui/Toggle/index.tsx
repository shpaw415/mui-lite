import { RippleBase } from "../../common/ripple";
import { useClassNames, useStyle } from "../../common/theme";
import {
  useMuiRef,
  type MuiElementColors,
  type MuiElementType,
} from "../../common/utils";

export type ToggleButtonProps = {
  children: any;
  selected?: boolean;
  size?: "small" | "medium" | "large";
  type?: "button" | "reset" | "submit";
} & Omit<MuiElementType<HTMLButtonElement>, "size">;

export default function ToggleButton({
  children,
  className,
  selected,
  size = "medium",
  ...props
}: ToggleButtonProps) {
  const button = useClassNames({
    component_name: "Toggle_Root",
    className,
    state: [selected && "selected", size],
  });
  const ref = useMuiRef(props.ref);

  return (
    <button className={button.combined} {...props} ref={ref}>
      {children}
      <RippleBase ref={ref} offset={{ top: -25, left: -25 }} />
    </button>
  );
}

type ToggleButtonGroupProps = {
  children: any;
  direction?: "row" | "column";
  size?: "small" | "medium" | "large";
  color?: MuiElementColors;
} & MuiElementType<HTMLDivElement>;

export function ToggleButtonGroup({
  children,
  direction,
  className,
  color,
  size,
  sx,
  ...props
}: ToggleButtonGroupProps) {
  const _style = useStyle(sx);

  const group = useClassNames({
    component_name: "Toggle_Group_Root",
    state: [direction, size, color],
    className,
  });

  return (
    <div
      role="group"
      className={group.combined}
      style={_style.styleFromSx}
      {...props}
    >
      {children}
    </div>
  );
}
