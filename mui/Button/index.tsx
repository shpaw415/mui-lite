"use client";
import { useClassNames, useStyle } from "../../common/theme";
import { RippleBase } from "../../common/ripple";
import clsx from "clsx";
import {
  PropsOverRideProvider,
  useMuiRef,
  usePropsOverRide,
  type MuiElementColors,
  type MuiElementType,
} from "@/common/utils";
import { useRef } from "react";

export type ButtonProps = {
  children: any;
  onClick?: (event: React.MouseEvent) => void;
  variant?: "contained" | "outlined" | "text";
  color?: MuiElementColors;
  size?: "small" | "medium" | "large";
} & Omit<MuiElementType<HTMLButtonElement>, "size"> &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;

function Button({
  children,
  sx,
  variant,
  color,
  className,
  size,
  ...props
}: ButtonProps) {
  const override = usePropsOverRide<ButtonProps>(arguments);
  const style = useStyle({ ...sx, ...(!color && override.sx) });
  const classes = useClassNames({
    component_name: "Button",
    variant: variant || override.variant || "contained",
    state: [color || override.color, size || override?.size],
    className: className,
    overRide: override,
  });
  const ref = useMuiRef<HTMLButtonElement>(props.ref);
  return (
    <button
      className={clsx(classes.combined, {
        "text-white":
          override?.variant == "contained" ||
          variant == "contained" ||
          (variant == undefined && override.variant == undefined),
      })}
      style={style.styleFromSx}
      {...props}
      ref={ref}
    >
      {children}
      <RippleBase ref={ref} preventClickElement />
    </button>
  );
}

export type MuiButtonGroupProps = Omit<
  MuiElementType<HTMLDivElement>,
  "size"
> & {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
};

export function ButtonGroup({ className, ...props }: MuiButtonGroupProps) {
  return (
    <PropsOverRideProvider<ButtonProps>
      props={{ variant: props.variant, size: props.size }}
    >
      <div
        role="group"
        className={[className, "MUI_ButtonGroup_Root"].join(" ")}
        {...props}
      />
    </PropsOverRideProvider>
  );
}

export default Button;
