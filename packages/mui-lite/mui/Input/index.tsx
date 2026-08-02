"use client";

import clsx from "clsx";
import {
	type InputHTMLAttributes,
	type ReactNode,
	type RefObject,
	useEffect,
	useState,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import { formControlState, useFormControl } from "../FormControl";

export type InputCommonProps = {
	startAdornment?: ReactNode;
	endAdornment?: ReactNode;
	fullWidth?: boolean;
	error?: boolean;
	disabled?: boolean;
	required?: boolean;
	multiline?: boolean | { minRows?: number; maxRows?: number; rows?: number };
	inputRef?: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
	inputProps?: InputHTMLAttributes<HTMLInputElement>;
	type?: string;
	value?: string | number | readonly string[];
	defaultValue?: string | number | readonly string[];
	placeholder?: string;
	name?: string;
	id?: string;
	autoFocus?: boolean;
	readOnly?: boolean;
	onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	color?: string;
	size?: "small" | "medium";
} & Omit<
	MuiElementType<HTMLDivElement>,
	"onChange" | "onFocus" | "onBlur" | "color"
>;

function useInputFilled(
	value: InputCommonProps["value"],
	defaultValue: InputCommonProps["defaultValue"],
) {
	const [local, setLocal] = useState(() =>
		Boolean(value ?? defaultValue ?? ""),
	);
	useEffect(() => {
		if (value !== undefined) setLocal(Boolean(value));
	}, [value]);
	return [
		local,
		(v: boolean) => setLocal(v),
	] as const;
}

function InputRoot({
	variant,
	startAdornment,
	endAdornment,
	fullWidth,
	error,
	disabled,
	required,
	multiline,
	inputRef,
	inputProps,
	type = "text",
	value,
	defaultValue,
	placeholder,
	name,
	id,
	autoFocus,
	readOnly,
	onChange,
	onFocus,
	onBlur,
	color,
	size,
	className,
	sx,
	children,
	...props
}: InputCommonProps & { variant: "standard" | "outlined" | "filled" }) {
	const fc = useFormControl();
	const fcs = formControlState(
		{ disabled, error, required, fullWidth, color, size },
		["disabled", "error", "required", "fullWidth", "color", "size", "focused"],
		fc,
	);
	const [filled, setFilled] = useInputFilled(value, defaultValue);

	useEffect(() => {
		fc?.onFilled(filled);
	}, [filled, fc]);

	const root = useClassNames({
		component_name: "Input",
		className,
		state: [
			`variant-${variant}`,
			fcs.disabled && "disabled",
			fcs.error && "error",
			fcs.focused && "focused",
			filled && "filled",
			(fcs.fullWidth ?? fullWidth) && "fullWidth",
			startAdornment && "adornedStart",
			endAdornment && "adornedEnd",
			multiline && "multiline",
			fcs.size === "small" && "size-small",
			fcs.color && `color-${fcs.color}`,
		],
	});
	const style = useStyle(sx);

	const handleFocus: React.FocusEventHandler<any> = (e) => {
		fc?.onFocus();
		onFocus?.(e);
		inputProps?.onFocus?.(e);
	};
	const handleBlur: React.FocusEventHandler<any> = (e) => {
		fc?.onBlur();
		onBlur?.(e);
		inputProps?.onBlur?.(e);
	};
	const handleChange: React.ChangeEventHandler<any> = (e) => {
		setFilled(Boolean(e.target.value));
		onChange?.(e);
		inputProps?.onChange?.(e);
	};

	const sharedInput = {
		...inputProps,
		ref: inputRef as any,
		id: id ?? fc?.htmlFor ?? inputProps?.id,
		name,
		type: multiline ? undefined : type,
		value,
		defaultValue,
		placeholder: placeholder ?? " ",
		disabled: fcs.disabled,
		required: fcs.required,
		readOnly,
		autoFocus,
		"aria-invalid": fcs.error || undefined,
		"aria-describedby": fc?.helperTextId,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onChange: handleChange,
		className: "MUI_Input_input",
	};

	const rows =
		typeof multiline === "object"
			? multiline.rows ?? multiline.minRows
			: undefined;

	return (
		<div className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx} {...props}>
			{startAdornment}
			{multiline ? (
				<textarea
					{...(sharedInput as any)}
					rows={typeof rows === "number" ? rows : 2}
				/>
			) : (
				<input {...(sharedInput as any)} />
			)}
			{endAdornment}
			{children}
			{variant === "outlined" && (
				<fieldset
					aria-hidden
					className="MUI_Input_notchedOutline"
					style={{
						// legend width for shrink handled via CSS :focus-within / .filled
					}}
				>
					<legend>
						<span>&#8203;</span>
					</legend>
				</fieldset>
			)}
		</div>
	);
}

/** Standard underline input */
export default function Input(props: InputCommonProps) {
	return <InputRoot variant="standard" {...props} />;
}

export function OutlinedInput(props: InputCommonProps) {
	return <InputRoot variant="outlined" {...props} />;
}

export function FilledInput(props: InputCommonProps) {
	return <InputRoot variant="filled" {...props} />;
}
