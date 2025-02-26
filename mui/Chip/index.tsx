import { RippleBase } from "../../common/ripple";
import { useClassNames, useStyle, useTheme } from "../../common/theme";
import {
  useValueOverRide,
  type MuiElementColors,
  type MuiElementType,
} from "../../common/utils";
import { type JSX, type RefObject } from "react";
import CancelIcon from "@svg/filled/cancel.svg";
import { useMuiRef } from "../../common/utils";

export type ChipProps = {
  variant?: "filled" | "outlined";
  onDelete?: (el: RefObject<HTMLDivElement>) => void;
  deleteIcon?: JSX.Element;
  avatar?: JSX.Element;
  color?: MuiElementColors;
  icon?: JSX.Element;
  size?: "small";
} & Omit<MuiElementType<HTMLDivElement>, "size">;

export default function Chip({
  variant = "filled",
  children,
  sx,
  onDelete,
  deleteIcon,
  avatar,
  className,
  color,
  icon,
  size,
  ...props
}: ChipProps) {
  const root = useClassNames({
    component_name: "Chip_Root",
    state: [
      variant,
      props.onClick && "clickable",
      onDelete && "deletable",
      "avatar-chip",
      color,
      size,
    ],
    className,
  });

  const theme = useTheme();

  const borderOutlinedVar = useValueOverRide({
    variable: "--chip-color",
    valueOverRide: theme.theme == "light" ? "189, 189, 189" : "97, 97, 97",
  });
  const avatarColorVar = useValueOverRide({
    variable: "--avatar-color",
    valueOverRide: theme.theme == "light" ? "97, 97, 97" : "224, 224, 224",
  });

  const style = useStyle(sx);
  const ref = useMuiRef(props.ref);

  return (
    <div
      className={root.combined}
      style={{
        ...(borderOutlinedVar as React.CSSProperties),
        ...(avatarColorVar as React.CSSProperties),
        ...style.styleFromSx,
      }}
      {...props}
      ref={ref}
    >
      {avatar && avatar}
      {icon && !Boolean(avatar) && icon}
      <span className="MUI_Chip_Content">
        {children}
        <RippleBase
          preventClickElement
          disabled={!Boolean(props.onClick) || Boolean(onDelete)}
          ref={ref}
          colorOverRide={theme["text-main"][theme.theme]}
        />
      </span>
      {onDelete && (
        <span
          className="MUI_Chip_Delete_Icon_Wrapper"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(ref as RefObject<HTMLDivElement>);
          }}
        >
          {deleteIcon ? deleteIcon : <CancelIcon />}
        </span>
      )}
    </div>
  );
}
