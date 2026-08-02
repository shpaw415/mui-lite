import clsx from "clsx";
import { createElement, type JSX } from "react";
import { type SxProps, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

export type BoxProps<T extends HTMLElement> = {
	Element?: keyof JSX.IntrinsicElements;
	sx?: SxProps;
} & MuiElementType<T>;

export default function Box<T extends HTMLElement>({
	sx,
	Element = "div",
	className,
	style,
	...props
}: BoxProps<T>) {
	const s = useStyle(sx);

	return createElement(Element, {
		...props,
		className: clsx(className, s.classNameFromSx),
		style: { ...s.styleFromSx, ...style },
	});
}
