"use client";

import clsx from "clsx";
import { createElement, type ElementType, type ReactNode } from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import { formControlState, useFormControl } from "../FormControl";

export type FormLabelProps = {
	children?: ReactNode;
	component?: ElementType;
	disabled?: boolean;
	error?: boolean;
	focused?: boolean;
	filled?: boolean;
	required?: boolean;
	color?: string;
	htmlFor?: string;
	id?: string;
} & MuiElementType<HTMLLabelElement>;

/**
 * Label for a group of controls (radios, checkboxes) or a fieldset.
 *
 * @example Radio group label
 * ```tsx
 * <FormLabel>Shipping method</FormLabel>
 * <RadioGroup>{/* radios */ /*}</RadioGroup>
 * ```
 */
export default function FormLabel({
	children,
	component = "label",
	disabled,
	error,
	focused,
	filled,
	required,
	color,
	className,
	sx,
	htmlFor,
	id,
	...props
}: FormLabelProps) {
	const fc = useFormControl();
	const fcs = formControlState(
		{ disabled, error, focused, filled, required, color },
		["disabled", "error", "focused", "filled", "required", "color"],
		fc,
	);

	const root = useClassNames({
		component_name: "FormLabel",
		className,
		state: [
			fcs.disabled && "disabled",
			fcs.error && "error",
			fcs.focused && "focused",
			fcs.filled && "filled",
			fcs.required && "required",
			fcs.color && `color-${fcs.color}`,
		],
	});
	const style = useStyle(sx);

	return createElement(
		component,
		{
			...props,
			htmlFor: htmlFor ?? fc?.htmlFor,
			id: id ?? fc?.labelId,
			className: clsx(root.combined, style.classNameFromSx),
			style: style.styleFromSx,
		},
		children,
		fcs.required && (
			<span className="MUI_FormLabel_asterisk" aria-hidden>
				{"\u2009*"}
			</span>
		),
	);
}
