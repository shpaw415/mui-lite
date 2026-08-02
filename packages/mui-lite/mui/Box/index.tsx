import clsx from "clsx";
import { createElement, type JSX } from "react";
import { type SxProps, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

export type BoxProps<T extends HTMLElement> = {
	Element?: keyof JSX.IntrinsicElements;
	sx?: SxProps;
} & MuiElementType<T>;

/**
 * Layout primitive with sx for spacing, color, and responsive styles.
 *
 * @example Padded section
 * ```tsx
 * <Box sx={{ p: 2, bgcolor: "background.paper" }}>Content</Box>
 * ```
 */
export default function Box<T extends HTMLElement>({
	sx,
	Element = "div",
	className,
	style,
	...props
}: BoxProps<T>): JSX.Element {
	const s = useStyle(sx);

	return createElement(Element, {
		...props,
		className: clsx(className, s.classNameFromSx),
		style: { ...s.styleFromSx, ...style },
	});
}
