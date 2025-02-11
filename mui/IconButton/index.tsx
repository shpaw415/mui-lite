import {
  useColorOverRide,
  usePropsOverRide,
  type MuiElementColors,
  type MuiElementType,
} from "@/common/utils";
import { RippleBase } from "@/common/ripple";
import { useClassNames, useStyle } from "@/common/theme";
import { useMemo, useRef } from "react";
import clsx from "clsx";

export type MuiIconButtonProps = {
  children: any;
  size?: "small" | "medium" | "large";
  color?: MuiElementColors;
  colorOverRide?: React.CSSProperties["color"];
  type?: HTMLButtonElement["type"];
} & Omit<MuiElementType<HTMLButtonElement>, "type" | "size">;

function IconButton({
  children,
  color,
  size,
  className,
  colorOverRide,
  sx,
  ...props
}: MuiIconButtonProps) {
  const propsOverRide = usePropsOverRide<MuiIconButtonProps>(arguments);

  const root = useClassNames({
    component_name: "IconButton_Root",
    className: className,
    overRide: propsOverRide?.className,
    state: [size, color],
  });

  const ref = useRef<HTMLButtonElement>(props.ref?.current || null);
  const style = useStyle({ ...propsOverRide.sx, ...sx });
  const overRideColorHex = useColorOverRide({
    colorOverRide: colorOverRide || propsOverRide.colorOverRide,
  });

  return (
    <Btn
      {...propsOverRide}
      {...props}
      className={clsx(root.combined, "cursor-pointer")}
      ref={ref}
      style={{
        ...style.styleFromSx,
        ...overRideColorHex,
      }}
    >
      {children}
      <RippleBase
        ref={ref}
        offset={{ top: -25, left: -25 }}
        color={color}
        colorOverRide={colorOverRide}
        preventClickElement
      />
    </Btn>
  );
}

function Btn({ colorOverRide, sx, size, color, ...props }: MuiIconButtonProps) {
  return <button {...props} />;
}

export default IconButton;
