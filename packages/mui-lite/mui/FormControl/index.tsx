"use client";

import clsx from "clsx";
import {
	createContext,
	createElement,
	type ElementType,
	type ReactNode,
	useCallback,
	useContext,
	useId,
	useMemo,
	useState,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementColors, MuiElementType } from "../../common/utils";

export type FormControlVariant = "standard" | "outlined" | "filled";
export type FormControlMargin = "none" | "dense" | "normal";
export type FormControlSize = "small" | "medium";

export type FormControlContextValue = {
	disabled: boolean;
	error: boolean;
	required: boolean;
	fullWidth: boolean;
	focused: boolean;
	filled: boolean;
	hiddenLabel: boolean;
	color: MuiElementColors | "primary" | "info";
	variant: FormControlVariant;
	margin: FormControlMargin;
	size: FormControlSize;
	htmlFor?: string;
	labelId?: string;
	helperTextId?: string;
	onFocus: () => void;
	onBlur: () => void;
	onFilled: (filled: boolean) => void;
	setAdornedStart: (v: boolean) => void;
	adornedStart: boolean;
	/** Plain label text for outlined notch sizing (from InputLabel) */
	labelText: string;
	setLabelText: (text: string) => void;
};

const FormControlContext = createContext<FormControlContextValue | null>(null);

export function useFormControl(): FormControlContextValue | null {
	return useContext(FormControlContext);
}

export function formControlState(
	props: Partial<{
		disabled?: boolean;
		error?: boolean;
		required?: boolean;
		focused?: boolean;
		filled?: boolean;
		color?: FormControlContextValue["color"];
		variant?: FormControlVariant;
		margin?: FormControlMargin;
		size?: FormControlSize;
		fullWidth?: boolean;
	}>,
	states: Array<keyof FormControlContextValue>,
	fc: FormControlContextValue | null,
) {
	return Object.fromEntries(
		states.map((key) => {
			const propVal = (props as any)[key];
			return [key, propVal !== undefined ? propVal : fc?.[key]];
		}),
	) as Partial<FormControlContextValue>;
}

export type FormControlProps = {
	children?: ReactNode;
	component?: ElementType;
	disabled?: boolean;
	error?: boolean;
	focused?: boolean;
	fullWidth?: boolean;
	hiddenLabel?: boolean;
	required?: boolean;
	color?: FormControlContextValue["color"];
	variant?: FormControlVariant;
	margin?: FormControlMargin;
	size?: FormControlSize;
} & MuiElementType<HTMLDivElement>;

/**
 * Field context for label, input, helper text, error, and size.
 *
 * @example Composed field
 * ```tsx
 * <FormControl error>
 *   <InputLabel>Email</InputLabel>
 *   <OutlinedInput />
 *   <FormHelperText>Required</FormHelperText>
 * </FormControl>
 * ```
 */
export default function FormControl({
	children,
	component = "div",
	disabled = false,
	error = false,
	focused: focusedProp,
	fullWidth = false,
	hiddenLabel = false,
	required = false,
	color = "primary",
	variant = "outlined",
	margin = "none",
	size = "medium",
	className,
	sx,
	...props
}: FormControlProps) {
	const [focusedState, setFocused] = useState(false);
	const [filled, setFilled] = useState(false);
	const [adornedStart, setAdornedStart] = useState(false);
	const [labelText, setLabelText] = useState("");
	const id = useId();
	const focused = focusedProp ?? focusedState;

	const onFocus = useCallback(() => setFocused(true), []);
	const onBlur = useCallback(() => setFocused(false), []);
	const onFilled = useCallback((v: boolean) => setFilled(v), []);

	const ctx = useMemo<FormControlContextValue>(
		() => ({
			disabled,
			error,
			required,
			fullWidth,
			focused,
			filled,
			hiddenLabel,
			color,
			variant,
			margin,
			size,
			htmlFor: `mui-fc-${id}`,
			labelId: `mui-fc-label-${id}`,
			helperTextId: `mui-fc-helper-${id}`,
			onFocus,
			onBlur,
			onFilled,
			setAdornedStart,
			adornedStart,
			labelText,
			setLabelText,
		}),
		[
			disabled,
			error,
			required,
			fullWidth,
			focused,
			filled,
			hiddenLabel,
			color,
			variant,
			margin,
			size,
			id,
			onFocus,
			onBlur,
			onFilled,
			adornedStart,
			labelText,
		],
	);

	const root = useClassNames({
		component_name: "FormControl",
		className,
		state: [
			fullWidth && "fullWidth",
			margin !== "none" && `margin-${margin}`,
			size === "small" && "size-small",
			disabled && "disabled",
			error && "error",
		],
	});
	const style = useStyle(sx);

	return (
		<FormControlContext value={ctx}>
			{createElement(
				component,
				{
					...props,
					className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
				},
				children,
			)}
		</FormControlContext>
	);
}

export { FormControlContext };
