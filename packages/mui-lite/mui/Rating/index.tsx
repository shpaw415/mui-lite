"use client";

import clsx from "clsx";
import {
	type ReactNode,
	useId,
	useState,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

function StarIcon({ filled }: { filled?: boolean }) {
	return (
		<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden focusable="false">
			{filled ? (
				<path
					d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
					fill="currentColor"
				/>
			) : (
				<path
					d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
					fill="currentColor"
				/>
			)}
		</svg>
	);
}

export type RatingProps = {
	name?: string;
	value?: number | null;
	defaultValue?: number | null;
	max?: number;
	precision?: number;
	readOnly?: boolean;
	disabled?: boolean;
	icon?: ReactNode;
	emptyIcon?: ReactNode;
	size?: "small" | "medium" | "large";
	highlightSelectedOnly?: boolean;
	getLabelText?: (value: number) => string;
	emptyLabelText?: string;
	onChange?: (event: React.SyntheticEvent, value: number | null) => void;
	onChangeActive?: (event: React.SyntheticEvent, value: number) => void;
} & Omit<MuiElementType<HTMLSpanElement>, "onChange" | "defaultValue">;

export default function Rating({
	name: nameProp,
	value: valueProp,
	defaultValue = null,
	max = 5,
	precision = 1,
	readOnly = false,
	disabled = false,
	icon,
	emptyIcon,
	size = "medium",
	highlightSelectedOnly = false,
	getLabelText = (v) => `${v} Star${v !== 1 ? "s" : ""}`,
	emptyLabelText = "Empty",
	onChange,
	onChangeActive,
	className,
	sx,
	...props
}: RatingProps) {
	const id = useId();
	const name = nameProp ?? id;
	const isControlled = valueProp !== undefined;
	const [internal, setInternal] = useState<number | null>(defaultValue);
	const value = isControlled ? valueProp : internal;
	const [hover, setHover] = useState(-1);
	const [focus, setFocus] = useState(-1);

	const display =
		hover !== -1 ? hover : focus !== -1 ? focus : (value ?? 0);

	const root = useClassNames({
		component_name: "Rating",
		className,
		state: [
			size,
			readOnly && "readOnly",
			disabled && "disabled",
			focus !== -1 && "focusVisible",
		],
	});
	const style = useStyle(sx);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: number) => {
		if (disabled || readOnly) return;
		// toggle off if same value clicked
		const next =
			value === newValue && precision === 1 ? null : newValue;
		if (!isControlled) setInternal(next);
		onChange?.(event, next);
	};

	const items: ReactNode[] = [];
	for (let i = 1; i <= max; i += precision) {
		const itemValue = Math.round(i * 100) / 100;
		const filled = highlightSelectedOnly
			? display === itemValue
			: display >= itemValue;
		const isEmpty = !filled;

		items.push(
			<span
				key={itemValue}
				className={`MUI_Rating_decimal${isEmpty ? " MUI_Rating_decimal_empty" : ""}`}
			>
				<label className="MUI_Rating_label">
					<input
						type="radio"
						className="MUI_Rating_visuallyHidden"
						name={name}
						value={itemValue}
						checked={value === itemValue}
						disabled={disabled || readOnly}
						onChange={(e) => handleChange(e, itemValue)}
						onClick={(e) => {
							if (value === itemValue) {
								handleChange(e as any, itemValue);
							}
						}}
						onFocus={() => setFocus(itemValue)}
						onBlur={() => setFocus(-1)}
					/>
					<span
						className={`MUI_Rating_icon${filled ? " MUI_Rating_icon_filled" : " MUI_Rating_icon_empty"}`}
						onMouseEnter={(e) => {
							if (!readOnly && !disabled) {
								setHover(itemValue);
								onChangeActive?.(e, itemValue);
							}
						}}
					>
						{filled
							? (icon ?? <StarIcon filled />)
							: (emptyIcon ?? <StarIcon />)}
					</span>
					<span className="MUI_Rating_visuallyHidden">
						{itemValue === 0 ? emptyLabelText : getLabelText(itemValue)}
					</span>
				</label>
			</span>,
		);
	}

	return (
		<span
			role={readOnly ? "img" : undefined}
			aria-label={
				readOnly
					? value
						? getLabelText(value)
						: emptyLabelText
					: undefined
			}
			className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx}
			onMouseLeave={() => {
				setHover(-1);
				onChangeActive?.({} as any, -1);
			}}
			{...props}
		>
			{items}
		</span>
	);
}
