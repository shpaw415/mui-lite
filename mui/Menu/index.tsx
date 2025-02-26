import {
  MuiSSRPortal,
  useClickAwayListener,
  usePreventScroll,
  useViewPortVisible,
} from "../../common/utils";
import Paper, { type PaperProps } from "../Paper";
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { useClassNames } from "../../common/theme";

export type MenuProps = {
  open?: boolean;
  onClose?: () => void;
  anchorEl?: RefObject<HTMLElement | null>;
  disablePreventScroll?: boolean;
  placement?: "top" | "left" | "right" | "bottom";
  transform?: Partial<{
    top: CSSProperties["transform"];
    left: CSSProperties["transform"];
    right: CSSProperties["transform"];
    bottom: CSSProperties["transform"];
  }>;
} & PaperProps;

export default function Menu({
  open,
  onClose,
  anchorEl,
  disablePreventScroll,
  placement = "bottom",
  className,
  transform,
  ...props
}: MenuProps) {
  const [prevent, restore] = usePreventScroll();
  const [preventClose, setPreventClose] = useState(false);
  const menuRef = useClickAwayListener(
    (e) => {
      if (!open || preventClose) return setPreventClose(false);
      onClose?.();
    },
    { deps: [onClose, open, preventClose] }
  );
  useEffect(() => {
    const ctrl = new AbortController();
    const handle: React.MouseEventHandler<HTMLElement> = (e) => {
      setPreventClose(true);
    };
    anchorEl?.current?.addEventListener("click", handle as any, {
      signal: ctrl.signal,
    });
    anchorEl?.current?.addEventListener("focus", handle as any, {
      signal: ctrl.signal,
    });

    return () => ctrl.abort();
  }, []);

  const [coord, setCoord] =
    useState<Partial<DOMRect & { transform: string }>>();

  const [placement_override, set_placement_override] =
    useState<MenuProps["placement"]>();

  const CoordSetter = useCallback(() => {
    if (!open || !menuRef.current) return;
    const coord = anchorEl?.current?.getBoundingClientRect();
    const menuCoord = getComputedStyle(menuRef.current);
    switch (placement_override || placement) {
      case "bottom":
        setCoord({
          top: (coord?.top || 0) + (coord?.height || 0),
          left: coord?.left || 0,
          transform: transform?.bottom,
        });
        break;
      case "top":
        setCoord({
          top:
            (coord?.top || 0) -
            (coord?.height || 0) -
            parseInt(menuCoord.height),
          left: coord?.left || 0,
          transform: transform?.top,
        });
        break;
      case "left":
        setCoord({
          top: coord?.top || 0,
          left: (coord?.left || 0) - parseInt(menuCoord.width),
          transform: transform?.left,
        });
        break;
      case "right":
        setCoord({
          top: coord?.top || 0,
          left:
            (coord?.left || 0) +
            parseInt(menuCoord.width) +
            (coord?.width || 0),
          transform: transform?.right,
        });
        break;
    }
  }, [open]);

  useViewPortVisible(
    ({ y, default_y, x, default_x }) => {
      if (default_y && default_x) return set_placement_override(undefined);

      switch (placement) {
        case "top":
          if (!y) set_placement_override("bottom");
          break;
        case "bottom":
          if (!y) set_placement_override("top");
          break;
        case "left":
          if (!x) set_placement_override("right");
          break;
        case "right":
          if (!x) set_placement_override("left");
          break;
      }
    },
    menuRef,
    [placement]
  );

  useEffect(() => {
    if (disablePreventScroll) return;
    if (open) {
      setTimeout(() => prevent(), 100);
      CoordSetter();
    } else {
      restore();
    }
  }, [open]);

  useEffect(() => {
    window.addEventListener("resize", CoordSetter);
    return () => {
      window.removeEventListener("resize", CoordSetter);
    };
  }, [open]);

  const menu = useClassNames({
    component_name: "Menu_Root",
    state: [open && "open"],
    className,
  });

  return (
    <MuiSSRPortal>
      <Paper
        elevation={8}
        {...props}
        ref={menuRef}
        className={menu.combined}
        sx={{ ...coord, ...props.sx }}
      />
    </MuiSSRPortal>
  );
}
