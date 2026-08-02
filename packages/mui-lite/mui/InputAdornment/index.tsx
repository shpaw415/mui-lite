"use client";

import clsx from "clsx";
import {
	createElement,
	type ElementType,
	type ReactNode,
	useEffect,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import { useFormControl } from "../FormControl";
import Typography from "../Typography";

export type InputAdornmentProps = {
	children?: ReactNode;
	position: "start" | "end";
	component?: ElementType;
	disablePointerEvents?: boolean;
	disableTypography?: boolean;
	variant?: "standard" | "outlined" | "filled";
} & MuiElementType<HTMLDivElement>;

/**
 * Start/end adornment (icons, units) inside text inputs.
 *
 * @example Currency prefix
 * ```tsx
 * <InputAdornment position="start">$</InputAdornment>
 * ```
 */
export default function InputAdornment({
	children,
	position,
	component = "div",
	disablePointerEvents = false,
	disableTypography = false,
	variant,
	className,
	sx,
	...props
}: InputAdornmentProps) {
	const fc = useFormControl();

	useEffect(() => {
		if (position === "start") {
			fc?.setAdornedStart(true);
			return () => fc?.setAdornedStart(false);
		}
	}, [position, fc]);

	const root = useClassNames({
		component_name: "InputAdornment",
		className,
		state: [
			`position-${position}`,
			disablePointerEvents && "disablePointerEvents",
			(variant ?? fc?.variant) && `variant-${variant ?? fc?.variant}`,
			fc?.hiddenLabel && "hiddenLabel",
			fc?.size === "small" && "size-small",
		],
	});
	const style = useStyle(sx);

	const content =
		typeof children === "string" && !disableTypography ? (
			<Typography Element="span">{children}</Typography>
		) : (
			children
		);

	return createElement(
		component,
		{
			...props,
			className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
		},
		content,
	);
}
