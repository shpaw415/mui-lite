import { createElement, type JSX } from "react";
import { useStyle, type SxProps } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

export type BoxProps<T extends HTMLElement> = {
  Element?: keyof JSX.IntrinsicElements;
  sx?: SxProps;
} & MuiElementType<T>;

export default function Box<T extends HTMLElement>({
  sx,
  Element = "div",
  ...props
}: BoxProps<T>) {
  const style = useStyle(sx);

  return createElement(Element, { ...props, style: style.styleFromSx });
}
