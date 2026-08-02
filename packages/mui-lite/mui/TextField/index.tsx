"use client";
import clsx from "clsx";
import { type RefObject, useId } from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType, SlotProps } from "../../common/utils";
import Box, { type BoxProps } from "../Box";
import InputBase, { type InputBaseProps } from "../InputBase";

export type TextFieldProps = {
	variant?: "outlined" | "filled" | "standard";
	startIcon?: any;
	endIcon?: any;
	label?: string;
	color?: "error" | "success" | "secondary";
	helpText?: string;
	multiline?:
		| boolean
		| {
				minRows?: number;
				maxRows?: number;
		  };
	children?: any;
	resetValue?: boolean;
	ref?: RefObject<HTMLInputElement | null>;
	SlotProps?: SlotProps<{
		endIconWrapper: BoxProps<HTMLSpanElement>;
		startIconWrapper: BoxProps<HTMLSpanElement>;
		helpText: BoxProps<HTMLParagraphElement>;
		input: InputBaseProps;
	}>;
} & Omit<MuiElementType<HTMLInputElement>, "size">;

function TextField({
	color,
	startIcon,
	label,
	variant = "standard",
	multiline,
	helpText,
	resetValue,
	endIcon,
	children,
	sx,
	SlotProps,
	className,
	...props
}: TextFieldProps) {
	const style = useStyle(sx);

	const classes_wrapper = useClassNames({
		component_name: "TextField_Wrapper",
		variant: variant,
		state: [color],
		className,
	});
	const classes_label = useClassNames({
		component_name: "TextField_label",
		variant: variant,
		state: [color],
	});

	const classes_box = useClassNames({
		component_name: "TextField_Box",
		variant: variant,
		state: [color],
	});

	const classes_animationWrapper = useClassNames({
		component_name: "TextField_AnimationWrapper",
		variant: variant,
		state: [color],
	});
	const classes_animationStyle = useClassNames({
		component_name: "TextField_AnimationStyle",
		variant: variant,
		state: [color],
	});

	const classes_fieldSet = useClassNames({
		component_name: "TextField_FieldSet",
		variant: variant,
		state: [color],
	});

	const classes_legend = useClassNames({
		component_name: "TextField_legend",
		variant: variant,
		state: [color],
	});

	const classes_helpText = useClassNames({
		component_name: "TextField_helpText",
		variant: variant,
		className: SlotProps?.helpText?.className,
		state: [color],
	});
	const idFromUseId = useId();
	const customIDForLabel = props.id || SlotProps?.input?.id || idFromUseId;

	return (
		<div className={clsx(classes_wrapper.combined, style.classNameFromSx)} style={style.styleFromSx}>
			<label className={classes_label.combined} htmlFor={customIDForLabel}>
				{label}
			</label>
			<div className={classes_box.combined}>
				{variant == "standard" && (
					<div className={classes_animationWrapper.combined}>
						<div className={classes_animationStyle.combined}></div>
					</div>
				)}
				{startIcon && (
					<Box<HTMLSpanElement>
						{...SlotProps?.startIconWrapper}
						Element="span"
						className={[
							"MUI_StartIcon",
							SlotProps?.startIconWrapper?.className,
						].join(" ")}
					>
						{startIcon}
					</Box>
				)}
				<InputBase
					id={customIDForLabel}
					variant={variant}
					{...props}
					{...SlotProps?.input}
					multiline={SlotProps?.input?.multiline ?? multiline}
				/>
				{children}
				{variant == "outlined" && (
					<fieldset className={classes_fieldSet.combined}>
						<legend className={classes_legend.combined}>
							<span>{label}</span>
						</legend>
					</fieldset>
				)}
				{endIcon && (
					<Box<HTMLSpanElement>
						{...SlotProps?.endIconWrapper}
						Element="span"
						className={[
							"MUI_EndIcon",
							SlotProps?.endIconWrapper?.className,
						].join(" ")}
					>
						{endIcon}
					</Box>
				)}
			</div>
			{helpText && (
				<Box<HTMLParagraphElement>
					{...SlotProps?.helpText}
					Element="p"
					className={classes_helpText.combined}
				>
					{helpText}
				</Box>
			)}
		</div>
	);
}

export default TextField;
