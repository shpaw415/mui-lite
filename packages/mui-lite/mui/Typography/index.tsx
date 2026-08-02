"use client";
import clsx from "clsx";
import type { JSX } from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementColors, MuiElementType } from "../../common/utils";
export type MuiTypographyProps<T extends HTMLElement> = {
	Element?: keyof JSX.IntrinsicElements;
	color?: MuiElementColors;
} & MuiElementType<T>;

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
			className={clsx(root.combined, _style.classNameFromSx)} style={_style.styleFromSx}
			{...(props as any)}
		>
			{children}
		</El>
	);
}
