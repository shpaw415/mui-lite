"use client";

import clsx from "clsx";
import {
	type ReactElement,
	type ReactNode,
	cloneElement,
	useId,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import { formControlState, useFormControl } from "../FormControl";
import Typography from "../Typography";

export type FormControlLabelProps = {
	control: ReactElement;
	label?: ReactNode;
	labelPlacement?: "end" | "start" | "top" | "bottom";
	disabled?: boolean;
	required?: boolean;
	checked?: boolean;
	value?: any;
	disableTypography?: boolean;
	onChange?: (event: React.SyntheticEvent, checked: boolean) => void;
	inputRef?: React.Ref<any>;
} & Omit<MuiElementType<HTMLLabelElement>, "onChange">;

/**
 * Pairs a control (checkbox, radio, switch) with an accessible label.
 *
 * @example Labeled switch
 * ```tsx
 * <FormControlLabel control={<Switch />} label="Notifications" />
 * ```
 */
export default function FormControlLabel({
	control,
	label,
	labelPlacement = "end",
	disabled,
	required,
	checked,
	value,
	disableTypography,
	onChange,
	inputRef,
	className,
	sx,
	...props
}: FormControlLabelProps) {
	const fc = useFormControl();
	const fcs = formControlState(
		{ disabled, required },
		["disabled", "required", "error"],
		fc,
	);
	const id = useId();

	const root = useClassNames({
		component_name: "FormControlLabel",
		className,
		state: [
			fcs.disabled && "disabled",
			fcs.error && "error",
			fcs.required && "required",
			`labelPlacement-${labelPlacement}`,
		],
	});
	const style = useStyle(sx);

	const controlProps: Record<string, unknown> = {
		disabled: control.props.disabled ?? fcs.disabled,
	};
	if (checked !== undefined) controlProps.checked = checked;
	if (value !== undefined) controlProps.value = value;
	if (inputRef) controlProps.ref = inputRef;
	if (onChange) {
		controlProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			control.props.onChange?.(e);
			onChange(e, e.target.checked);
		};
	}
	if (!control.props.id) controlProps.id = `mui-fcl-${id}`;

	const controlNode = cloneElement(control, controlProps);

	const labelNode =
		label == null ? null : disableTypography || typeof label !== "string" ? (
			label
		) : (
			<Typography Element="span" className="MUI_FormControlLabel_label">
				{label}
				{fcs.required && (
					<span className="MUI_FormControlLabel_asterisk" aria-hidden>
						{"\u2009*"}
					</span>
				)}
			</Typography>
		);

	return (
		<label
			className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx}
			htmlFor={controlProps.id as string}
			{...props}
		>
			{labelPlacement === "start" || labelPlacement === "top" ? (
				<>
					{labelNode}
					{controlNode}
				</>
			) : (
				<>
					{controlNode}
					{labelNode}
				</>
			)}
		</label>
	);
}
