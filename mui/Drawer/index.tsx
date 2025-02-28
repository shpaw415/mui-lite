import { useClassNames } from "../../common/theme";
import Paper, { type PaperProps } from "../Paper";
import { usePreventScroll, type SlotProps } from "../../common/utils";
import {
  useEffect,
  useRef,
  type CSSProperties,
  type JSX,
  type RefObject,
} from "react";
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

  const [prevent, restore] = usePreventScroll();

  useEffect(() => {
    if (variant != "temporary") return;
    open ? prevent() : restore();
  }, [open]);

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
          ...{
            "--closed-width": minifiedWidth || "0px",
            "--width": `${width ?? 200}px`,
          },
          ...props.sx,
        }}
      />
    </>
  );
}
