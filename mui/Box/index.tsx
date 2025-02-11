import { createElement, type ElementType } from "react";
import { useStyle } from "../../common/theme";
import type { MuiElementType } from "@/common/utils";

export type BoxProps = {
  Element?: ElementType;
} & MuiElementType<HTMLDivElement>;

export default function Box({ sx, Element = "div", ...props }: BoxProps) {
  const style = useStyle(sx);

  return createElement(Element, { ...props, style: style.styleFromSx });
}
