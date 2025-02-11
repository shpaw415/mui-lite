import { useClassNames, useStyle } from "@/common/theme";
import { useColorOverRide, type MuiElementType } from "@/common/utils";
import { createElement, type CSSProperties, type JSX } from "react";

export type SkeletonProps = {
  /** default: text */
  variant?: "text" | "circular" | "rectangular" | "rounded";
  element?: keyof JSX.IntrinsicElements;
  /**  default: pulse */
  animation?: "wave" | "pulse" | false;
  colorOverRide?: CSSProperties["color"];
} & MuiElementType<HTMLSpanElement>;

export default function Skeleton({
  variant,
  className,
  colorOverRide,
  sx,
  animation = "pulse",
  element = "span",
  width,
  height,
  children,
  ...props
}: SkeletonProps) {
  const style = useStyle(
    { width, height, ...sx },
    {
      opacity: {
        backgroundColor: 0.11,
      },
    }
  );
  const root = useClassNames({
    component_name: "Skeleton_Root",
    className,
    state: [variant || "text", animation, animation === false && "none"],
  });
  const bgColorOverRide = useColorOverRide({
    colorOverRide,
  });
  return createElement(element, {
    className: root.combined,
    style: { ...style.styleFromSx, ...bgColorOverRide },
    children: children && (
      <div className="MUI_Skeleton_children">{children}</div>
    ),
    ...props,
  });
}
