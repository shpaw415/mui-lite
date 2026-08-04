"use client";
import clsx from "clsx";
import {
	type JSX,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { RippleBase } from "../../common/ripple";
import { useClassNames, useStyle } from "../../common/theme";
import {
	type MuiElementColors,
	type MuiElementType,
	type SlotProps,
	useColorOverRide,
	useMuiRef,
} from "../../common/utils";
import Box, { type BoxProps } from "../Box";
import Typography from "../Typography";
import { CheckboxBorderIcon, CheckboxCheckedIcon } from "./icons";

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

/**
 * Multi-select boolean control for forms and filters.
 *
 * @example Accept terms
 * ```tsx
 * <FormControlLabel control={<CheckBox />} label="I agree" />
 * ```
 */
export default function CheckBox({
	label,
	size = "medium",
	color = "primary",
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
	const hostRef = useRef<HTMLSpanElement>(null);

	const wrapper = useClassNames({
		component_name: "Checkbox",
		state: [color, size],
		className: SlotProps?.container?.className,
	});

	// Visual root reuses IconButton styles (circular hit target + hover) without a
	// nested <button> — the input is the only interactive control.
	const controlRoot = useClassNames({
		component_name: "IconButton_Root",
		state: [size, color, props.disabled && "disabled"],
	});
	const style = useStyle(sx);
	const overRideColorHex = useColorOverRide({ colorOverRide });

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
	// Force re-render when the native checked state changes so the icon updates.
	const [, setState] = useState(Boolean(props.defaultChecked));

	useEffect(() => {
		const el = _ref.current;
		if (!el) return;
		const onNativeChange = () => {
			setState((c) => !c);
		};
		// Do not stopPropagation — React 17+ root delegation needs the event
		// to bubble so props.onChange (and FormControlLabel) still fire.
		el.addEventListener("change", onNativeChange);
		return () => el.removeEventListener("change", onNativeChange);
	}, [_ref]);

	const checked =
		props.checked == undefined
			? (_ref.current?.checked ?? props.defaultChecked)
			: props.checked;

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
			<span
				ref={hostRef}
				className={clsx(
					"MUI_Checkbox_root",
					controlRoot.combined,
					style.classNameFromSx,
				)}
				style={{
					...style.styleFromSx,
					...overRideColorHex,
				}}
			>
				{/* Input covers the full circular host so padding and icon share one hit target.
				    No programmatic re-click from ripple — that double-toggled on press+release. */}
				<input
					type="checkbox"
					className="MUI_Checkbox_input"
					id={ID}
					{...props}
					ref={_ref}
				/>
				<span className="MUI_Checkbox_control" aria-hidden>
					{RenderCheck({ checked })}
				</span>
				{!props.disabled && (
					<RippleBase
						ref={hostRef}
						color={color}
						colorOverRide={colorOverRide}
						preventClickElement
						disabled={Boolean(props.disabled)}
					/>
				)}
			</span>

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
