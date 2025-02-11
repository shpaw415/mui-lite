import { useClassNames, useStyle, useTheme } from "@/common/theme";
import {
  useValueOverRide,
  type ElevationType,
  type MuiElementType,
} from "@/common/utils";
import { createElement, useMemo, type ElementType } from "react";

export type PaperProps = {
  elevation?: ElevationType;
  variant?: "elevation" | "outlined";
  square?: boolean;
  element?: ElementType;
} & MuiElementType<HTMLDivElement>;

export default function Paper({
  elevation = 1,
  sx,
  className,
  variant = "elevation",
  square,
  element = "div",
  ...props
}: PaperProps) {
  const theme = useTheme();
  const style = useStyle(sx);

  const calculatedOverlay = useMemo(() => {
    if (theme.theme == "light" || variant == "outlined") return "none";
    const calculatedOverlayOpacity = ((elevation * 0.165) / 24).toPrecision(3);
    return `linear-gradient(rgba(var(--bg-surface-light), ${calculatedOverlayOpacity}), rgba(var(--bg-surface-light), ${calculatedOverlayOpacity}))`;
  }, [elevation, theme.theme]);

  const overlayVariable = useValueOverRide({
    variable: "--Paper-overlay",
    valueOverRide: calculatedOverlay,
  });

  const root = useClassNames({
    component_name: "Paper_Root",
    className,
    state: [elevation && `elevation${elevation}`, variant, square && "square"],
  });

  return createElement(element, {
    className: root.combined,
    style: {
      ...overlayVariable,
      ...style.styleFromSx,
    },
    ...props,
  });
}
