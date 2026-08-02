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
	/**
	 * Label text for the outlined notch (gap in the border).
	 * Usually taken from FormControl / InputLabel automatically.
	 */
	label?: string;
	/** Force the outlined notch open (defaults to filled || focused) */
	notched?: boolean;
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
	label,
	notched: notchedProp,
	className,
	sx,
	children,
	...props
}: InputCommonProps & { variant: "standard" | "outlined" | "filled" }) {
	const fc = useFormControl();
	const fcs = formControlState(
		{
			disabled,
			error,
			required,
			fullWidth,
			color: color as any,
			size: size as any,
		},
		[
			"disabled",
			"error",
			"required",
			"fullWidth",
			"color",
			"size",
			"focused",
			"filled",
		],
		fc,
	);
	const [filled, setFilled] = useInputFilled(value, defaultValue);

	useEffect(() => {
		fc?.onFilled(filled);
	}, [filled, fc]);

	const isFilled = Boolean(fcs.filled || filled);
	const isFocused = Boolean(fcs.focused);
	// Same conditions as InputLabel shrink — notch only when the label floats up.
	// (Do not open the border gap while the label still sits in the field center.)
	const labelShrunk = Boolean(
		isFilled || isFocused || fc?.adornedStart || startAdornment,
	);
	const notched = notchedProp ?? labelShrunk;
	const notchLabel = label ?? fc?.labelText ?? "";

	const root = useClassNames({
		component_name: "Input",
		className,
		state: [
			`variant-${variant}`,
			fcs.disabled && "disabled",
			fcs.error && "error",
			isFocused && "focused",
			isFilled && "filled",
			notched && "notched",
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
					className={clsx(
						"MUI_Input_notchedOutline",
						notched && "MUI_Input_notchedOutline_notched",
					)}
				>
					{/* Invisible legend creates a gap in the top border where the label sits */}
					<legend className="MUI_Input_notchedOutline_legend">
						<span>{notchLabel ? notchLabel : "\u200B"}</span>
					</legend>
				</fieldset>
			)}
		</div>
	);
}

/** Standard underline input */
/**
 * Standard underline input for FormControl composition.
 *
 * @example Amount field
 * ```tsx
 * <FormControl variant="standard">
 *   <InputLabel>Amount</InputLabel>
 *   <Input startAdornment={<InputAdornment position="start">$</InputAdornment>} />
 * </FormControl>
 * ```
 */
export default function Input(props: InputCommonProps) {
	return <InputRoot variant="standard" {...props} />;
}

/**
 * Outlined border input for FormControl composition.
 *
 * @example Email field
 * ```tsx
 * <FormControl>
 *   <InputLabel>Email</InputLabel>
 *   <OutlinedInput type="email" />
 * </FormControl>
 * ```
 */
export function OutlinedInput(props: InputCommonProps) {
	return <InputRoot variant="outlined" {...props} />;
}

/**
 * Filled variant text input surface (FormControl composition).
 *
 * @example With label
 * ```tsx
 * <FormControl variant="filled">
 *   <InputLabel>Email</InputLabel>
 *   <FilledInput />
 * </FormControl>
 * ```
 */
export function FilledInput(props: InputCommonProps) {
	return <InputRoot variant="filled" {...props} />;
}
