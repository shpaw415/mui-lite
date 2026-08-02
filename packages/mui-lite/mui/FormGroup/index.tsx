import clsx from "clsx";
import { createElement, type ElementType, type ReactNode } from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

export type FormGroupProps = {
	children?: ReactNode;
	component?: ElementType;
	row?: boolean;
} & MuiElementType<HTMLDivElement>;

/**
 * Groups related checkboxes or switches in a form section.
 *
 * @example Permission set
 * ```tsx
 * <FormGroup>
 *   <FormControlLabel control={<CheckBox />} label="Read" />
 *   <FormControlLabel control={<CheckBox />} label="Write" />
 * </FormGroup>
 * ```
 */
export default function FormGroup({
	children,
	component = "div",
	row = false,
	className,
	sx,
	...props
}: FormGroupProps) {
	const root = useClassNames({
		component_name: "FormGroup",
		className,
		state: [row && "row"],
	});
	const style = useStyle(sx);

	return createElement(
		component,
		{
			...props,
			className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
			role: props.role ?? "group",
		},
		children,
	);
}
