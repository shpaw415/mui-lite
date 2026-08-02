"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import FormLabel, { type FormLabelProps } from "../FormLabel";
import { formControlState, useFormControl } from "../FormControl";

export type InputLabelProps = {
	children?: ReactNode;
	disableAnimation?: boolean;
	shrink?: boolean;
	size?: "small" | "medium";
	variant?: "standard" | "outlined" | "filled";
	margin?: "dense";
} & FormLabelProps &
	MuiElementType<HTMLLabelElement>;

export default function InputLabel({
	children,
	disableAnimation = false,
	shrink: shrinkProp,
	size,
	variant,
	margin,
	className,
	sx,
	...props
}: InputLabelProps) {
	const fc = useFormControl();
	const fcs = formControlState(
		{ ...props, size, variant, margin },
		[
			"disabled",
			"error",
			"focused",
			"filled",
			"required",
			"color",
			"variant",
			"size",
			"margin",
		],
		fc,
	);

	const shrink =
		shrinkProp ??
		Boolean(fcs.filled || fcs.focused || fc?.adornedStart);

	const root = useClassNames({
		component_name: "InputLabel",
		className,
		state: [
			!disableAnimation && "animated",
			shrink && "shrink",
			fc && "formControl",
			(variant ?? fcs.variant) && `variant-${variant ?? fcs.variant}`,
			(size ?? fcs.size) === "small" && "size-small",
			fcs.disabled && "disabled",
			fcs.error && "error",
			fcs.focused && "focused",
			fcs.required && "required",
		],
	});
	const style = useStyle(sx);

	return (
		<FormLabel
			{...props}
			className={clsx(root.combined, style.classNameFromSx)} style={{ ...style.styleFromSx, ...(props as any).style }}
			disabled={fcs.disabled}
			error={fcs.error}
			focused={fcs.focused}
			filled={fcs.filled}
			required={fcs.required}
			color={fcs.color as any}
			htmlFor={props.htmlFor ?? fc?.htmlFor}
			id={props.id ?? fc?.labelId}
		>
			{children}
		</FormLabel>
	);
}
