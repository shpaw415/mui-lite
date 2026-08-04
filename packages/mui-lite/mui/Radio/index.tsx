"use client";

import clsx from "clsx";
import type { RefObject, SVGProps } from "react";
import RippleEffect from "../../common/ripple";
import { type SxProps, useStyle } from "../../common/theme";

function FrameSVG(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			focusable="false"
			aria-hidden="true"
			viewBox="0 0 24 24"
			className={props.className}
			{...props}
		>
			<path
				fill="currentColor"
				d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
			/>
		</svg>
	);
}

function ButtonSVG(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			focusable="false"
			aria-hidden="true"
			viewBox="0 0 24 24"
			className={props.className}
			{...props}
		>
			<path
				fill="currentColor"
				d="M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z"
			/>
		</svg>
	);
}

type RadioButtonProps = {
	checked?: boolean;
	label?: string;
	labelDirection?: "top" | "right" | "bottom" | "left";
	disabled?: boolean;
	color?: "error" | "success";
	sx?: SxProps;
	ref?: RefObject<HTMLInputElement | null>;
} & React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;

/**
 * Single-select control within a radio group.
 *
 * @example Plan choice
 * ```tsx
 * <FormControlLabel value="pro" control={<Radio />} label="Pro" />
 * ```
 */
export default function Radio({
	sx,
	className,
	label,
	color,
	labelDirection,
	...props
}: RadioButtonProps) {
	const style = useStyle(sx);

	return (
		<div className={className}>
			<RippleEffect
				className={clsx(
					"MUI_RadioButton_frame",
					color && `MUI_RadioButton_frame_${color}`,
					color && `_${color}`,
				)}
				color={color}
			>
				<input type="radio" className="MUI_radio_input" {...props} />
				<div className={clsx("MUI_Radio_Inner", style.classNameFromSx)} style={style.styleFromSx}>
					<FrameSVG className="MUI_Radio_SVG_Frame" />
					<ButtonSVG className="MUI_Radio_SVG_Button" />
				</div>
			</RippleEffect>
			{label}
		</div>
	);
}
