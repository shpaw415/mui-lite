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
  useIsOutOfViewport,
  useMuiRef,
  useValueOverRide,
  type SlotProps,
} from "../../common/utils";
import { useClassNames, type SxProps } from "../../common/theme";
import Typography, { type MuiTypographyProps } from "../Typography";
import Box, { type BoxProps } from "../Box";

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
  offSet?: {
    x?: string;
    y?: string;
  };
  transition?: "fade" | "zoom" | "none";
  triggers?: Array<"hover" | "focus" | "click">;
  children: JSX.Element;
  ref?: React.RefObject<HTMLParagraphElement>;
  variant?: "light" | "dark";
  SlotProps?: SlotProps<{
    container: BoxProps<HTMLDivElement>;
  }>;
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
  SlotProps,
  ...props
}: ToolTipProps) {
  const [, _setTimeout] = useState<Timer>();
  const [active, setActive] = useState(open || false);
  const [bypassPlacement, setBypassPlacement] = useState<
    ToolTipProps["placement"] | null
  >();
  const elRef = useMuiRef<HTMLElement>(children.props.ref);
  const toolTipRef = useMuiRef<HTMLDivElement>(props.ref);

  const tooltipIsVisible = useIsOutOfViewport(toolTipRef);

  useEffect(() => {
    if (tooltipIsVisible || !active || bypassPlacement === null) {
      if (tooltipIsVisible && bypassPlacement === null) {
        setBypassPlacement(undefined);
      }
      return;
    }
    switch (placement) {
      case "top":
        if (bypassPlacement == undefined && !tooltipIsVisible)
          setBypassPlacement("bottom");
        else if (bypassPlacement == "bottom" && !tooltipIsVisible)
          setBypassPlacement("left");
        else if (bypassPlacement == "left" && !tooltipIsVisible)
          setBypassPlacement("right");
        else setBypassPlacement(null);
        break;
      case "bottom":
        if (bypassPlacement == undefined && !tooltipIsVisible)
          setBypassPlacement("top");
        else if (bypassPlacement == "top" && !tooltipIsVisible)
          setBypassPlacement("left");
        else if (bypassPlacement == "left" && !tooltipIsVisible)
          setBypassPlacement("right");
        else setBypassPlacement(null);
        break;
      case "left":
        if (bypassPlacement == undefined && !tooltipIsVisible)
          setBypassPlacement("right");
        else if (bypassPlacement == "right" && !tooltipIsVisible)
          setBypassPlacement("top");
        else if (bypassPlacement == "top" && !tooltipIsVisible)
          setBypassPlacement("bottom");
        else setBypassPlacement(null);
        break;
      case "right":
        if (bypassPlacement == undefined && !tooltipIsVisible)
          setBypassPlacement("left");
        else if (bypassPlacement == "left" && !tooltipIsVisible)
          setBypassPlacement("top");
        else if (bypassPlacement == "top" && !tooltipIsVisible)
          setBypassPlacement("bottom");
        else setBypassPlacement(null);
        break;
    }
  }, [tooltipIsVisible, bypassPlacement]);

  useEffect(() => {
    if (active != open && open != undefined) setActive(open);
  }, [open]);

  const showTip = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      onOpen?.(e);
      if (disabled || open != undefined) return;
      _setTimeout((c) => {
        clearTimeout(c);
        return setTimeout(() => {
          setActive(true);
        }, enterDelay ?? 400);
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
        return setTimeout(() => setActive(false), leaveDelay ?? 100);
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

  const offsetX = useValueOverRide({
    variable: "--tooltip-offset-x",
    valueOverRide: offSet?.x,
  });
  const offsetY = useValueOverRide({
    variable: "--tooltip-offset-y",
    valueOverRide: offSet?.y,
  });
  return (
    <Box
      {...SlotProps?.container}
      className={[
        "MUI_Tooltip-Container",
        SlotProps?.container?.className,
      ].join(" ")}
    >
      {cloneElement(children, {
        ref: elRef,
      })}
      <Typography
        role="tooltip"
        {...props}
        sx={{
          ...({
            "--tooltip-background-color":
              variant == "dark" ? "97, 97, 97" : "255, 255, 255",
            ...offsetX,
            ...offsetY,
            ...bgVar,
          } as SxProps),
          ...props.sx,
        }}
        className={tooltip.combined}
        ref={toolTipRef}
      >
        {title}
      </Typography>
    </Box>
  );
}
