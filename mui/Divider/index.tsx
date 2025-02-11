import { useClassNames } from "@/common/theme";
import type { MuiElementType } from "@/common/utils";
import { createElement, useCallback, type JSX } from "react";

export type DividerProps = {
  component?: keyof JSX.IntrinsicElements;
  variant?: "inset" | "middle" | "fullWidth";
  orientation?: "vertical" | "horizontal";
  textAlign?: "center" | "left" | "right";
} & MuiElementType<HTMLHRElement>;

export default function Divider({
  className,
  component = "hr",
  variant,
  orientation = "horizontal",
  textAlign = "center",
  ...props
}: DividerProps) {
  const root = useClassNames({
    component_name: "Divider_Root",
    className,
    state: [
      variant,
      orientation,
      Boolean(props?.children) && "hasChildren",
      textAlign,
    ],
  });
  if (props.children) component = "span";

  const MakeElement = useCallback(
    () =>
      createElement(component, {
        ...props,
        className: root.combined,
        role: "separator",
        "aria-orientation": orientation,
      }),
    [orientation, root.combined]
  );

  return props.children ? (
    <div className="MUI_Divier_Wrapper">{MakeElement()}</div>
  ) : (
    MakeElement()
  );
}
