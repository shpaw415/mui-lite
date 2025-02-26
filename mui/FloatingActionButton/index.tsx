import { RippleBase } from "@/common/ripple";
import {
  useClassNames,
  useStyle,
  useTheme,
  type SxProps,
} from "@/common/theme";
import {
  useColorOverRide,
  type MuiElementColors,
  type MuiElementType,
} from "@/common/utils";
import { useMuiRef } from "../../common/utils";

export type FABProps = {
  color?: MuiElementColors;
  children?: any;
  type?: HTMLButtonElement["type"];
  variant?: "extended";
  size?: "small" | "medium" | "large";
  bgColorOverRide?: React.CSSProperties["color"];
  colorOverRide?: React.CSSProperties["color"];
} & Omit<MuiElementType<HTMLButtonElement>, "type" | "size">;

export default function FAB({
  className,
  color,
  children,
  sx,
  variant,
  size,
  bgColorOverRide,
  colorOverRide,
  ...props
}: FABProps) {
  const btn = useClassNames({
    component_name: "FAB_Root",
    className,
    state: [color, variant, size],
  });
  const ref = useMuiRef(props.ref);
  const style = useStyle(sx);
  const bgOverride = useColorOverRide({
    colorOverRide: bgColorOverRide,
    variable: "--bg-color-override",
  });
  const rippleColorOverRide = useColorOverRide({
    colorOverRide: bgColorOverRide,
    offset(current, utils) {
      return utils.ToGray(current, 40);
    },
  });
  const colorOverride = useColorOverRide({
    colorOverRide,
    variable: "--color-override-fill",
  });
  return (
    <button
      className={btn.combined}
      style={{
        ...bgOverride,
        ...colorOverride,
        ...rippleColorOverRide,
        ...style.styleFromSx,
      }}
      {...props}
      ref={ref}
    >
      {children}
      <RippleBase
        ref={ref}
        offset={{ top: -10, left: -10 }}
        preventClickElement
      />
    </button>
  );
}
