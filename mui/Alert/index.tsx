import { PropsOverRideProvider, useColorOverRide } from "@/common/utils";
import { useMemo, type CSSProperties, type JSX } from "react";

import ErrorIcon from "@svg/filled/error_outline.svg";
import WarningIcon from "@svg/filled/warning_amber.svg";
import CloseIcon from "@svg/filled/close.svg";

import InfoIcon from "./info.svg";
import SuccessIcon from "./success.svg";
import Paper, { type PaperProps } from "../Paper";
import { useClassNames, useStyle, useTheme } from "@/common/theme";
import clsx from "clsx";
import type { ButtonProps } from "../Button";
import IconButton from "../IconButton";
import { type SlotProps } from "../../common/utils";
import Box, { type BoxProps } from "../Box";

export type AlertProps = {
  variant?: "default" | "filled" | "outlined";
  severity: "error" | "info" | "warning" | "success";
  icon?: JSX.Element | false;
  action?: JSX.Element;
  title?: string;
  textColor?: CSSProperties["color"];
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  SlotProps?: SlotProps<{
    icon?: BoxProps;
  }>;
} & Omit<PaperProps, "variant" | "action">;

export default function Alert({
  sx,
  variant = "default",
  severity,
  icon,
  action,
  title,
  children,
  textColor,
  onClose,
  SlotProps,
  ...props
}: AlertProps) {
  const Icon = useMemo(() => {
    if (icon != undefined) return icon;
    switch (severity) {
      case "error":
        return <ErrorIcon />;
      case "info":
        return <InfoIcon />;
      case "success":
        return <SuccessIcon />;
      case "warning":
        return <WarningIcon />;
      default:
        return undefined;
    }
  }, [icon, severity]);

  const theme = useTheme();

  const currentThemeColor = useMemo(() => {
    switch (severity) {
      case "error":
        return theme["text-error"][theme.theme];
      case "info":
        return theme["text-info"][theme.theme];
      case "success":
        return theme["text-success"][theme.theme];
      case "warning":
        return theme["text-warning"][theme.theme];
    }
  }, [severity, theme.theme]);

  const colorOverride = useColorOverRide(
    {
      colorOverRide: currentThemeColor,
      offset(rgb, utils) {
        if (theme.theme == "light") return utils.Darker(rgb, 100);
        return utils.Lighter(rgb, 140);
      },
    },
    [currentThemeColor]
  );

  const root = useClassNames({
    component_name: "Alert_Root",
    state: [variant, severity],
  });
  const style = useStyle(sx);

  return (
    <Paper
      role="alert"
      style={{
        ...style.styleFromSx,
        ...colorOverride,
      }}
      className={[root.combined, "flex"].join(" ")}
      elevation={0}
      {...props}
    >
      {Icon && (
        <Box
          {...SlotProps?.icon}
          className={["MUI_Alert_icon", SlotProps?.icon?.className].join(" ")}
        >
          {Icon}
        </Box>
      )}
      {title && <div className="MUI_Alert_Title">{title}</div>}
      {children}
      <PropsOverRideProvider<ButtonProps>
        props={{ variant: "text", color: severity as any }}
      >
        {action && <div className="MUI_Alert_Action">{action}</div>}
        {!action && onClose && (
          <div className="MUI_Alert_Action">
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        )}
      </PropsOverRideProvider>
    </Paper>
  );
}
