"use client";

import clsx from "clsx";
import { createElement, type ElementType, type ReactNode } from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import { formControlState, useFormControl } from "../FormControl";

export type FormHelperTextProps = {
	children?: ReactNode;
	component?: ElementType;
	disabled?: boolean;
	error?: boolean;
	focused?: boolean;
	filled?: boolean;
	required?: boolean;
	margin?: "dense";
	variant?: "standard" | "outlined" | "filled";
	id?: string;
} & MuiElementType<HTMLParagraphElement>;

/**
 * Helper or error text under a FormControl field.
 *
 * @example Validation message
 * ```tsx
 * <FormHelperText error>Invalid email</FormHelperText>
 * ```
 */
export default function FormHelperText({
	children,
	component = "p",
	disabled,
	error,
	focused,
	filled,
	required,
	margin,
	variant,
	className,
	sx,
	id,
	...props
}: FormHelperTextProps) {
	const fc = useFormControl();
	const fcs = formControlState(
		{ disabled, error, focused, filled, required, variant, margin },
		["disabled", "error", "focused", "filled", "required", "variant", "margin", "size"],
		fc,
	);

	const v = (variant ?? fcs.variant) as string | undefined;
	const root = useClassNames({
		component_name: "FormHelperText",
		className,
		state: [
			fcs.disabled && "disabled",
			fcs.error && "error",
			fcs.focused && "focused",
			fcs.filled && "filled",
			fcs.required && "required",
			(v === "outlined" || v === "filled") && "contained",
			fcs.size === "small" && "size-small",
			(margin ?? fcs.margin) === "dense" && "margin-dense",
		],
	});
	const style = useStyle(sx);

	return createElement(
		component,
		{
			...props,
			id: id ?? fc?.helperTextId,
			className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
		},
		children,
	);
}
