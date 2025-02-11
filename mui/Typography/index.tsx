"use client";
import type { MuiElementColors } from "@/common/utils";
import { useClassNames, useStyle, type SxProps } from "../../common/theme";
import { type RefObject, type JSX } from "react";
export type MuiTypographyProps<T extends HTMLElement> = {
  children?: any;
  Element?: keyof JSX.IntrinsicElements;
  className?: string;
  sx?: SxProps;
  ref?: RefObject<HTMLElement>;
  color?: MuiElementColors;
} & Omit<T, "style">;

export default function Typography<T>({
  children,
  Element = "p",
  className,
  sx,
  color,
  ...props
}: //@ts-ignore
MuiTypographyProps<T>) {
  const _style = useStyle(sx);
  const root = useClassNames({
    component_name: "Typography_Root",
    className,
    state: [color],
  });
  const El = Element as keyof JSX.IntrinsicElements;

  return (
    <El
      style={_style.styleFromSx}
      className={root.combined}
      {...(props as any)}
    >
      {children}
    </El>
  );
}
