import clsx from "clsx";
import { createElement, type ElementType, type ReactNode } from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementColors, MuiElementType } from "../../common/utils";

export type LinkProps = {
	children?: ReactNode;
	component?: ElementType;
	href?: string;
	underline?: "none" | "hover" | "always";
	color?: MuiElementColors | "inherit" | "textPrimary" | "textSecondary";
	variant?: string;
} & Omit<MuiElementType<HTMLAnchorElement>, "color">;

export default function Link({
	children,
	component,
	href,
	underline = "always",
	color = "primary",
	variant = "inherit",
	className,
	sx,
	...props
}: LinkProps) {
	const Comp: ElementType = component ?? "a";
	const root = useClassNames({
		component_name: "Link",
		className,
		state: [
			`underline-${underline}`,
			color && `color-${color}`,
			variant !== "inherit" && variant,
			Comp === "button" && "button",
		],
	});
	const style = useStyle(sx);

	return createElement(
		Comp,
		{
			...props,
			href: Comp === "a" ? href : undefined,
			className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
			type: Comp === "button" ? "button" : undefined,
		},
		children,
	);
}
