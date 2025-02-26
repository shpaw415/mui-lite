import { useClassNames } from "../../common/theme";
import Paper, { type PaperProps } from "../Paper";
import { type SlotProps } from "../../common/utils";
import { useRef, type CSSProperties, type JSX, type RefObject } from "react";
import Backdrop, { type BackdropProps } from "../Backdrop";
import { useSwipe, type SwipeOptions } from "../../common/swipe";

export type DrawerProps = {
  open?: boolean;
  variant?: "permanent" | "persistent" | "temporary";
  children: any;
  SlotProps?: SlotProps<{
    backdrop: BackdropProps;
  }>;
  hideBackdrop?: boolean;
  anchor?: "bottom" | "left" | "right" | "top";
  onClose?: () => void;
  onOpen?: () => void;
  swipeOptions?: {
    options?: SwipeOptions;
    ref?: RefObject<HTMLElement | null>;
  };
  width: CSSProperties["width"];
  minifiedWidth?: CSSProperties["width"];
} & Partial<Omit<PaperProps, "variant" | "children">>;

export default function Drawer({
  open,
  variant = "temporary",
  anchor = "left",
  SlotProps,
  hideBackdrop,
  swipeOptions,
  onClose,
  onOpen,
  width,
  minifiedWidth,
  ...props
}: DrawerProps) {
  const root = useClassNames({
    component_name: "Drawer_Root",
    className: props?.className,
    state: [open && "open", variant, anchor, minifiedWidth && "minified"],
  });
  const ref = useRef(
    typeof window != "undefined" ? document.querySelector("body") : null
  );

  useSwipe(
    swipeOptions?.ref || ref,
    {
      swipeStatus(direction) {
        switch (anchor) {
          case "left":
            if (direction == "right") onOpen?.();
            break;
          case "right":
            if (direction == "left") onOpen?.();
            break;
          default:
            break;
        }
      },
      ...swipeOptions?.options,
    },
    [anchor],
    !Boolean(swipeOptions) || anchor == "bottom" || anchor == "top"
  );

  return (
    <>
      <Backdrop
        open={!Boolean(hideBackdrop) && open && variant == "temporary"}
        {...SlotProps?.backdrop}
        onClick={(e) => {
          SlotProps?.backdrop?.onClick?.(e);
          onClose?.();
        }}
      />
      <Paper
        elevation={16}
        square
        {...props}
        className={root.combined}
        onClick={(e) => {
          props.onClick?.(e);
          onClose?.();
        }}
        sx={{
          width: open ? width : undefined,
          ...{ "--closed-width": minifiedWidth || "0px" },
          ...props.sx,
        }}
      />
    </>
  );
}
