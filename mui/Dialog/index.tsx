import Paper, { type PaperProps } from "../Paper";
import Backdrop, { type BackdropProps } from "../Backdrop";
import { type MuiTypographyProps } from "../Typography/index";
import clsx from "clsx";
import {
  PropsOverRideProvider,
  useDragElement,
  useMuiRef,
  type MuiElementType,
  type SlotProps,
} from "@/common/utils";
import { useClassNames, useStyle } from "@/common/theme";
import type { ButtonProps } from "../Button";
import { Children, useCallback, useRef } from "react";

export type DialogProps = {
  onBackdropClick?: React.MouseEventHandler<HTMLDivElement>;
  onClose?: () => void;
  disableBackDrop?: boolean;
  slotProps?: SlotProps<{
    backdrop: BackdropProps;
    paper: PaperProps;
  }>;
  transition?: "slide" | "fade" | "none";
  keepMounted?: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  draggable?: boolean;
  onDrag?: (e: MouseEvent) => void;
  scroll?: "paper" | "body";
} & Omit<MuiElementType<HTMLDivElement>, "onDrag">;

export default function Dialog({
  onBackdropClick,
  disableBackDrop,
  slotProps,
  open,
  onClose,
  className,
  sx,
  children,
  transition = "fade",
  keepMounted,
  fullScreen,
  fullWidth,
  draggable,
  onDrag,
  scroll,
  ...props
}: DialogProps) {
  const root = useClassNames({
    component_name: "Dialog_Root",
    state: [
      open && "open",
      disableBackDrop && "backdrop-disabled",
      transition,
      fullScreen && "fullScreen",
      fullWidth && "fullWidth",
      draggable && "draggable",
      scroll,
    ],
    className,
  });
  const style = useStyle(sx);

  const paperClick = useCallback<React.MouseEventHandler<HTMLDivElement>>(
    (e) => {
      e.stopPropagation();
      slotProps?.paper?.onClick?.(e);
    },
    []
  );
  const ref = useMuiRef(props.ref);
  useDragElement({
    element: ref,
    disabled: !draggable,
    onDrag,
  });

  return (
    <div
      role="presentation"
      tabIndex={-1}
      className={root.combined}
      style={style.styleFromSx}
      {...props}
    >
      <BackDropEnabler
        onClick={(e) => {
          onBackdropClick?.(e);
          onClose?.();
        }}
        {...slotProps?.backdrop}
        open={open}
        enabled={!disableBackDrop && !fullScreen}
      >
        <BodyScroll enable={scroll == "body" || fullScreen}>
          <Paper
            role="dialog"
            aria-modal
            elevation={24}
            {...slotProps?.paper}
            className={`${
              slotProps?.paper?.className ?? ""
            } MUI_Paper_Dialog_Root`}
            onClick={paperClick}
            ref={ref}
          >
            {(open || keepMounted) && children}
          </Paper>
        </BodyScroll>
      </BackDropEnabler>
    </div>
  );
}

function BackDropEnabler({
  enabled,
  ...props
}: BackdropProps & { enabled: boolean }) {
  if (!enabled) return props.children;
  return <Backdrop {...props} />;
}

function BodyScroll({ enable, children }: { enable?: boolean; children: any }) {
  if (!enable) return children;
  return <div className="MUI_Dialog_Body_Scroll_Root">{children}</div>;
}

export function DialogTitle({
  className,
  sx,
  ...props
}: MuiElementType<HTMLHeadingElement>) {
  const style = useStyle(sx);
  return (
    <h2
      className={clsx(className, "MUI_Dialog_Title_Root")}
      style={style.styleFromSx}
      {...props}
    />
  );
}

export type DialogContentProps = {} & MuiElementType<HTMLDivElement>;

export function DialogContent({ className, sx, ...props }: DialogContentProps) {
  const style = useStyle(sx);
  return (
    <div
      className={"MUI_Dialog_Content_Root " + (className || "")}
      style={style.styleFromSx}
      {...props}
    />
  );
}

export type DialogActionsProps = {} & MuiElementType<HTMLDivElement>;

export function DialogActions({ className, sx, ...props }: DialogActionsProps) {
  const style = useStyle(sx);
  return (
    <PropsOverRideProvider<ButtonProps>
      props={{
        variant: "text",
        sx: {
          color: {
            "text-primary": "light",
          },
        },
      }}
    >
      <div
        style={style.styleFromSx}
        className={"MUI_Dialog_Action_Root " + className || ""}
        {...props}
      />
    </PropsOverRideProvider>
  );
}
