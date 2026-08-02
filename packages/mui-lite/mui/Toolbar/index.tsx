import clsx from "clsx";
import { createElement, type ElementType, type ReactNode } from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

export type ToolbarProps = {
	children?: ReactNode;
	component?: ElementType;
	disableGutters?: boolean;
	variant?: "regular" | "dense";
} & MuiElementType<HTMLDivElement>;

export default function Toolbar({
	children,
	component = "div",
	disableGutters = false,
	variant = "regular",
	className,
	sx,
	...props
}: ToolbarProps) {
	const root = useClassNames({
		component_name: "Toolbar",
		className,
		state: [variant, !disableGutters && "gutters", disableGutters && "disableGutters"],
	});
	const style = useStyle(sx);

	return createElement(
		component,
		{
			...props,
			className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
		},
		children,
	);
}
