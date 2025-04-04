import {
  useColorOverRide,
  useMuiRef,
  usePropsOverRide,
  type MuiElementColors,
  type MuiElementType,
} from "../../common/utils";
import { RippleBase } from "../../common/ripple";
import { useClassNames, useStyle } from "../../common/theme";

export type MuiIconButtonProps = {
  children: any;
  size?: "small" | "medium" | "large";
  color?: MuiElementColors;
  colorOverRide?: React.CSSProperties["color"];
  type?: HTMLButtonElement["type"];
  onRippleClick?: () => void;
} & Omit<MuiElementType<HTMLButtonElement>, "type" | "size">;

function IconButton({
  children,
  color = "primary",
  size,
  className,
  colorOverRide,
  sx,
  onRippleClick,
  ...props
}: MuiIconButtonProps) {
  const propsOverRide = usePropsOverRide<MuiIconButtonProps>(arguments);

  const root = useClassNames({
    component_name: "IconButton_Root",
    className: className,
    overRide: propsOverRide?.className,
    state: [size, color],
  });

  const ref = useMuiRef(props.ref);
  const style = useStyle({ ...propsOverRide.sx, ...sx });
  const overRideColorHex = useColorOverRide({
    colorOverRide: colorOverRide || propsOverRide.colorOverRide,
  });

  return (
    <Btn
      {...propsOverRide}
      {...props}
      className={root.combined}
      ref={ref}
      style={{
        ...style.styleFromSx,
        ...overRideColorHex,
      }}
    >
      {children}
      <RippleBase
        ref={ref}
        color={color}
        colorOverRide={colorOverRide}
        preventClickElement
        onRippleClick={onRippleClick}
      />
    </Btn>
  );
}

function Btn({ colorOverRide, sx, size, color, ...props }: MuiIconButtonProps) {
  return <button {...props} />;
}

export default IconButton;
