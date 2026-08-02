"use client";

import clsx from "clsx";
import {
	type ReactNode,
	type RefObject,
	useEffect,
	useState,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import { formControlState, useFormControl } from "../FormControl";

export type NativeSelectProps = {
	children?: ReactNode;
	inputRef?: RefObject<HTMLSelectElement | null>;
	fullWidth?: boolean;
	error?: boolean;
	disabled?: boolean;
	required?: boolean;
	value?: string | number | readonly string[];
	defaultValue?: string | number | readonly string[];
	name?: string;
	id?: string;
	multiple?: boolean;
	onChange?: React.ChangeEventHandler<HTMLSelectElement>;
	onFocus?: React.FocusEventHandler<HTMLSelectElement>;
	onBlur?: React.FocusEventHandler<HTMLSelectElement>;
	variant?: "standard" | "outlined" | "filled";
	IconComponent?: React.ComponentType<{ className?: string }>;
} & Omit<
	MuiElementType<HTMLDivElement>,
	"onChange" | "onFocus" | "onBlur"
>;

function DefaultIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			focusable="false"
			aria-hidden
			viewBox="0 0 24 24"
			width="24"
			height="24"
		>
			<path d="M7 10l5 5 5-5z" fill="currentColor" />
		</svg>
	);
}

export default function NativeSelect({
	children,
	inputRef,
	fullWidth,
	error,
	disabled,
	required,
	value,
	defaultValue,
	name,
	id,
	multiple,
	onChange,
	onFocus,
	onBlur,
	variant,
	IconComponent = DefaultIcon,
	className,
	sx,
	...props
}: NativeSelectProps) {
	const fc = useFormControl();
	const fcs = formControlState(
		{ disabled, error, required, fullWidth, variant },
		["disabled", "error", "required", "fullWidth", "variant", "focused", "size"],
		fc,
	);
	const v = (variant ?? fcs.variant ?? "standard") as string;
	const [filled, setFilled] = useState(Boolean(value ?? defaultValue));

	useEffect(() => {
		if (value !== undefined) setFilled(Boolean(value));
	}, [value]);
	useEffect(() => {
		fc?.onFilled(filled);
	}, [filled, fc]);

	const root = useClassNames({
		component_name: "NativeSelect",
		className,
		state: [
			`variant-${v}`,
			fcs.disabled && "disabled",
			fcs.error && "error",
			fcs.focused && "focused",
			filled && "filled",
			(fcs.fullWidth ?? fullWidth) && "fullWidth",
			multiple && "multiple",
			fcs.size === "small" && "size-small",
		],
	});
	const style = useStyle(sx);

	return (
		<div className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx} {...props}>
			<select
				ref={inputRef}
				id={id ?? fc?.htmlFor}
				name={name}
				disabled={fcs.disabled}
				required={fcs.required}
				value={value}
				defaultValue={defaultValue}
				multiple={multiple}
				aria-invalid={fcs.error || undefined}
				aria-describedby={fc?.helperTextId}
				className="MUI_NativeSelect_select"
				onFocus={(e) => {
					fc?.onFocus();
					onFocus?.(e);
				}}
				onBlur={(e) => {
					fc?.onBlur();
					onBlur?.(e);
				}}
				onChange={(e) => {
					setFilled(Boolean(e.target.value));
					onChange?.(e);
				}}
			>
				{children}
			</select>
			{!multiple && <IconComponent className="MUI_NativeSelect_icon" />}
		</div>
	);
}
