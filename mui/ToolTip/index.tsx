import {
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type JSX,
} from "react";
import {
  MuiSSRPortal,
  useColorOverRide,
  useMuiRef,
  useValueOverRide,
  useViewPortVisible,
} from "../../common/utils";
import { useClassNames, type SxProps } from "../../common/theme";
import Typography, { type MuiTypographyProps } from "../Typography";

export type ToolTipProps = {
  placement?: "bottom" | "left" | "right" | "top";
  title: string | JSX.Element;
  open?: boolean;
  onClose?: (event: React.SyntheticEvent) => void;
  onOpen?: (event: React.SyntheticEvent) => void;
  arrow?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  disabled?: boolean;
  backgroundColor?: CSSProperties["backgroundColor"];
  offSet?: number;
  transition?: "fade" | "zoom" | "none";
  triggers?: Array<"hover" | "focus" | "click">;
  children: JSX.Element;
  ref?: React.RefObject<HTMLParagraphElement>;
  variant?: "light" | "dark";
} & MuiTypographyProps<HTMLParagraphElement>;

export default function ToolTip({
  placement = "bottom",
  title,
  open,
  onClose,
  onOpen,
  className,
  arrow,
  disabled,
  enterDelay,
  leaveDelay,
  backgroundColor,
  color,
  offSet,
  transition,
  children,
  triggers = ["hover"],
  variant = "dark",
  ...props
}: ToolTipProps) {
  const [, _setTimeout] = useState<Timer>();
  const [active, setActive] = useState(open || false);
  const [bypassPlacement, setBypassPlacement] =
    useState<ToolTipProps["placement"]>();
  const [coord, setCoord] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });

  const [tooltipRef, triggerCheck] = useViewPortVisible(
    (visible) => {
      if (visible.x && visible.y) return setBypassPlacement(undefined);
      switch (placement) {
        case "top":
          setBypassPlacement("bottom");
          break;
        case "bottom":
          setBypassPlacement("top");
          break;
        case "left":
          setBypassPlacement("right");
          break;
        case "right":
          setBypassPlacement("left");
          break;
      }
    },
    props.ref,
    [placement]
  );
  const elRef = useMuiRef<HTMLElement>(children.props.ref);

  const coordSetter = useCallback(() => {
    const coord = elRef.current?.getBoundingClientRect();
    setCoord({
      top: coord?.top || 0,
      left: coord?.left || 0,
    });
  }, [elRef.current]);

  useEffect(() => coordSetter(), [elRef.current]);

  useEffect(() => {
    if (active != open && open != undefined) setActive(open);
  }, [open]);

  useEffect(() => {
    triggerCheck();
  }, [active]);

  const showTip = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      onOpen?.(e);
      if (disabled || open != undefined) return;
      coordSetter();
      _setTimeout((c) => {
        clearTimeout(c);
        return setTimeout(() => {
          setActive(true);
        }, enterDelay || 400);
      });
    },
    [disabled, props.onMouseEnter, onOpen]
  );

  const hideTip = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      onClose?.(e);
      if (open != undefined) return;
      _setTimeout((c) => {
        clearTimeout(c);
        return setTimeout(() => setActive(false), leaveDelay || 100);
      });
    },
    [open, props.onMouseLeave, onClose]
  );

  const transitionPaires = useMemo<[string, string]>(() => {
    switch (transition) {
      case "zoom":
        return ["MUI_Zoom_In", "MUI_Zoom_Out"];
      case "none":
        return ["", ""];
      case "fade":
      default:
        return ["MUI_Fade_In", "MUI_Fade_Out"];
    }
  }, [transition]);
  const tooltip = useClassNames({
    component_name: "Tooltip-Tip",
    className: [
      className,
      active ? transitionPaires[0] : transitionPaires[1],
    ].join(" "),
    state: [
      bypassPlacement || placement,
      active && "open",
      arrow && "arrow",
      variant,
    ],
  });

  const bgVar = useColorOverRide({
    variable: "--tooltip-background-color",
    colorOverRide: backgroundColor,
  });

  useEffect(() => {
    const onclickHandler = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      showTip(e);
      children.props.onClick?.(e);
    };
    const focusHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      showTip(e);
      children.props.onFocus?.(e);
    };
    const blurHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      hideTip(e);
      children.props.onBlur?.(e);
    };
    const mouseEnterHandler = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      showTip(e);
      children.props.onMouseEnter?.(e);
    };
    const mouseLeaveHandler = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      hideTip(e);
      children.props.onMouseLeave?.(e);
    };

    const toReturn: { type: keyof HTMLElementEventMap; func: any }[] = [];

    for (const trigger of triggers) {
      switch (trigger) {
        case "click":
          elRef.current?.addEventListener("click", onclickHandler as any);
          toReturn.push({ type: "click", func: onclickHandler });
          break;
        case "focus":
          elRef.current?.addEventListener("focus", focusHandler as any);
          elRef.current?.addEventListener("blur", blurHandler as any);
          toReturn.push(
            { type: "focus", func: focusHandler },
            { type: "blur", func: blurHandler }
          );
          break;
        case "hover":
          elRef.current?.addEventListener(
            "mouseenter",
            mouseEnterHandler as any
          );
          elRef.current?.addEventListener(
            "mouseleave",
            mouseLeaveHandler as any
          );
          toReturn.push(
            { type: "mouseenter", func: mouseEnterHandler },
            { type: "mouseleave", func: mouseLeaveHandler }
          );
          break;
      }
    }

    return () => {
      toReturn.forEach(({ type, func }) => {
        elRef.current?.removeEventListener(type, func);
      });
    };
  }, [triggers]);

  const { width, height } = useMemo(() => {
    const el = elRef.current?.getBoundingClientRect();
    return {
      width: { half: (el?.width || 0) / 2, full: Math.round(el?.width || 0) },
      height: {
        half: (el?.height || 0) / 2,
        full: Math.round(el?.height || 0),
      },
    };
  }, [elRef.current, active, open]);

  const marginOverRide = useValueOverRide({
    variable: "--tooltip-margin",
    valueOverRide: `${offSet ?? 15}px`,
  });

  return (
    <>
      {cloneElement(children, {
        ref: elRef,
      })}
      <MuiSSRPortal>
        <Typography
          role="tooltip"
          {...props}
          sx={{
            ...({
              "--element-width": `${width.full}px`,
              "--element-height": `${height.full}px`,
              "--tooltip-background-color":
                variant == "dark" ? "97, 97, 97" : "255, 255, 255",
              ...marginOverRide,
            } as SxProps),
            ...coord,
            ...(bgVar as SxProps),
            ...props.sx,
          }}
          className={tooltip.combined}
          ref={tooltipRef as React.RefObject<HTMLParagraphElement>}
        >
          {title}
        </Typography>
      </MuiSSRPortal>
    </>
  );
}
