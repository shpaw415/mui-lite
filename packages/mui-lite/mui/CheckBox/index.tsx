"use client";
import clsx from "clsx";
import { type JSX, useCallback, useEffect, useId, useState } from "react";
import { useClassNames } from "../../common/theme";
import {
	type MuiElementColors,
	type MuiElementType,
	type SlotProps,
	useMuiRef,
} from "../../common/utils";
import Box, { type BoxProps } from "../Box";
import IconButton from "../IconButton";
import Typography from "../Typography";
import {
	CheckboxBorderIcon,
	CheckboxCheckedIcon,
} from "./icons";

type _MuiCheckBox = {
	label?: string;
	labelSide?: "top" | "bottom" | "left" | "right";
	size?: "small" | "medium" | "large";
	color?: MuiElementColors;
	colorOverRide?: React.CSSProperties["color"];
	SlotProps?: SlotProps<{
		container: BoxProps<HTMLDivElement>;
	}>;
} & Omit<MuiElementType<HTMLInputElement>, "size" | "color">;

export type MuiCheckBox =
	| (_MuiCheckBox & {
			icon: JSX.Element;
			checkedIcon: JSX.Element;
	  })
	| (_MuiCheckBox & {
			icon?: undefined;
			checkedIcon?: undefined;
	  });

export default function CheckBox({
	label,
	size,
	color,
	sx,
	labelSide = "right",
	icon,
	checkedIcon,
	colorOverRide,
	ref,
	SlotProps,
	...props
}: MuiCheckBox) {
	const _ref = useMuiRef<HTMLInputElement>(ref);

	const wrapper = useClassNames({
		component_name: "Checkbox",
		state: [color, size],
		className: SlotProps?.container?.className,
	});
	const idFromUseId = useId();
	const ID = props.id || "ID_" + idFromUseId;

	const RenderCheck = useCallback(
		({ checked }: { checked?: boolean }) => {
			if (!icon || !checkedIcon) {
				if (checked) return <CheckboxCheckedIcon />;
				return <CheckboxBorderIcon />;
			}
			if (checked) return checkedIcon;
			return icon;
		},
		[icon, checkedIcon],
	);
	const [, setState] = useState(Boolean(props.defaultChecked));

	useEffect(() => {
		const ctrl = new AbortController();

		_ref.current?.addEventListener("change", (ev) => {
			ev.stopPropagation();
			setState((c) => !c);
		});

		return () => ctrl.abort();
	}, [_ref]);

	const clickOnRef = useCallback<() => void>(
		() => _ref.current?.click(),
		[_ref],
	);

	return (
		<Box
			{...SlotProps?.container}
			className={clsx(
				"MUI_Checkbox_layout",
				labelSide === "right" && "MUI_Checkbox_layout_right",
				labelSide === "bottom" && "MUI_Checkbox_layout_bottom",
				labelSide === "left" && "MUI_Checkbox_layout_left",
				labelSide === "top" && "MUI_Checkbox_layout_top",
				wrapper.combined,
			)}
		>
			<IconButton
				color={color}
				colorOverRide={colorOverRide}
				disabled={props.disabled}
				onRippleClick={clickOnRef}
				size={size}
				sx={sx}
				type="button"
			>
				<div className="MUI_Checkbox_control">
					{RenderCheck({
						checked:
							props.checked == undefined
								? (_ref.current?.checked ?? props.defaultChecked)
								: props.checked,
					})}
					<input
						type="checkbox"
						className="MUI_Checkbox_input"
						id={ID}
						{...props}
						ref={_ref}
					/>
				</div>
			</IconButton>

			{label && (
				<Typography<
					React.DetailedHTMLProps<
						React.LabelHTMLAttributes<HTMLLabelElement>,
						HTMLLabelElement
					>
				>
					Element="label"
					className="ml-1"
					htmlFor={ID}
					tabIndex={-1}
				>
					{label + (props.required ? "*" : "")}
				</Typography>
			)}
		</Box>
	);
}
