import {
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
} from "react";
import Box, { type BoxProps } from "../Box";
import {
  useColorOverRide,
  useValueOverRide,
  useViewPortVisible,
  type SlotProps,
} from "../../common/utils";
import { useClassNames, type SxProps } from "@/common/theme";
import Typography, { type MuiTypographyProps } from "../Typography";

export type ToolTipProps = {
  placement?: "bottom" | "left" | "right" | "top";
  children: JSX.Element;
  title: string | JSX.Element;
  open?: boolean;
  onClose?: (event: React.SyntheticEvent) => void;
  onOpen?: (event: React.SyntheticEvent) => void;
  SlotProps?: SlotProps<{
    toolTip?: Partial<MuiTypographyProps<HTMLParagraphElement>>;
    wrapper?: Partial<BoxProps>;
  }>;
  arrow?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  disabled?: boolean;
  backgroundColor?: CSSProperties["backgroundColor"];
  offSet?: number;
  transition?: "fade" | "zoom" | "none";
  triggers?: Array<"hover" | "focus" | "click">;
} & BoxProps;

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
  SlotProps,
  backgroundColor,
  color,
  offSet,
  transition,
  children,
  triggers = ["hover"],
  ...props
}: ToolTipProps) {
  const [, _setTimeout] = useState<Timer>();
  const [active, setActive] = useState(open || false);
  const [bypassPlacement, setBypassPlacement] =
    useState<ToolTipProps["placement"]>();

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
    SlotProps?.toolTip?.ref,
    [placement]
  );

  useEffect(() => {
    if (active != open && open != undefined) setActive(open);
  }, [open]);

  useEffect(() => {
    triggerCheck();
  }, [active]);

  const showTip = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      props.onMouseEnter?.(e);
      onOpen?.(e);
      if (disabled || open != undefined) return;
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
      props.onMouseLeave?.(e);
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
      SlotProps?.toolTip?.className,
      active ? transitionPaires[0] : transitionPaires[1],
    ].join(" "),
    state: [bypassPlacement || placement, active && "open", arrow && "arrow"],
  });

  const bgVar = useColorOverRide({
    variable: "--tooltip-background-color",
    colorOverRide: backgroundColor,
  });
  const marginOverride = useValueOverRide({
    variable: "--tooltip-margin",
    valueOverRide: `${35 + (offSet || 0)}px`,
  });

  const elRef = useRef<HTMLElement>(props.ref?.current || null);

  const triggerProp = useMemo<Partial<BoxProps>>(() => {
    return Object.assign(
      {},
      ...(triggers?.map((trigger) => {
        switch (trigger) {
          case "click":
            return {
              onClick: showTip,
            };
          case "focus":
            return {
              onFocus: showTip,
              onBlur: hideTip,
            };
          case "hover":
            return {
              onMouseEnter: showTip,
              onMouseLeave: hideTip,
            };
        }
      }) || [])
    ) as Partial<BoxProps>;
  }, [triggers]);

  return (
    <Box
      {...props}
      sx={{
        ...(marginOverride as SxProps),
        ...(bgVar as SxProps),
        ...props.sx,
      }}
      className={["MUI_Tooltip-Wrapper", className].join(" ")}
      {...triggerProp}
    >
      {cloneElement(children, {
        ref: elRef,
      })}
      <Typography
        {...SlotProps?.toolTip}
        className={tooltip.combined}
        ref={tooltipRef as React.RefObject<HTMLParagraphElement>}
      >
        {title}
      </Typography>
    </Box>
  );
}
