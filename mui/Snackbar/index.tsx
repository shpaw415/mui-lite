import { useClassNames } from "../../common/theme";
import type { PaperProps } from "../Paper";
import Paper from "../Paper";
import { useEffect, useState, type JSX } from "react";
import { type MuiElementType, type SlotProps } from "../../common/utils";
import Box, { type BoxProps } from "../Box";

type SnackCommon = {
  message?: string | JSX.Element;
  action?: JSX.Element | JSX.Element[];
};

export type SnackbarProps = SnackCommon & {
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  SlotProps?: SlotProps<{
    paper: PaperProps;
    message: BoxProps<HTMLDivElement>;
    action: BoxProps<HTMLDivElement>;
  }>;
  animation?: "fade" | "slide";
  animationSide?: "left" | "right" | "bottom" | "top";
  open?: boolean;
  autoHideDuration?: number;
  onClose?: () => void;
} & Omit<MuiElementType<HTMLDivElement>, "action">;

export default function Snackbar({
  className,
  message,
  action,
  position = "top-left",
  SlotProps,
  animation = "fade",
  animationSide,
  open,
  autoHideDuration,
  onClose,
  children,
  ...props
}: SnackbarProps) {
  const root = useClassNames({
    component_name: "Snackbar_Root",
    className,
    state: [position, open && "open", animation, animationSide],
  });
  const [, setTimer] = useState<Timer>();
  useEffect(() => {
    if (open && autoHideDuration)
      setTimer((c) => {
        clearTimeout(c);
        return setTimeout(() => {
          onClose?.();
        }, autoHideDuration);
      });
    else if (!open)
      setTimer((c) => {
        clearTimeout(c);
        return undefined;
      });
  }, [open]);

  return (
    <div role="alert" className={root.combined} {...props}>
      {children ? (
        children
      ) : (
        <Paper
          elevation={6}
          {...SlotProps?.paper}
          className={[
            "MUI_Snackbar_Inner",
            SlotProps?.paper?.className,
            children && "child",
          ].join(" ")}
        >
          <SnackbarContent
            message={message}
            action={action}
            SlotProps={SlotProps}
          />
        </Paper>
      )}
    </div>
  );
}

export type SnackbarContentProps = SnackCommon & {
  SlotProps?: SlotProps<{
    message: BoxProps<HTMLDivElement>;
    action: BoxProps<HTMLDivElement>;
  }>;
};

export function SnackbarContent({
  message,
  action,
  SlotProps,
}: SnackbarContentProps) {
  return (
    <>
      {message && (
        <Box
          {...SlotProps?.action}
          children={message}
          className={[
            "MUI_Snackbar_Content_Root",
            SlotProps?.message?.className,
          ].join(" ")}
        />
      )}
      {action && (
        <Box
          {...SlotProps?.action}
          className={[
            "MUI_Snackbar_Action_Root",
            SlotProps?.action?.className,
          ].join(" ")}
          children={action}
        />
      )}
    </>
  );
}
