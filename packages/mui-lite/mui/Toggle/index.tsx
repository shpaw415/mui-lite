import clsx from "clsx";
import { RippleBase } from "../../common/ripple";
import { useClassNames, useStyle } from "../../common/theme";
import {
	type MuiElementColors,
	type MuiElementType,
	useMuiRef,
} from "../../common/utils";

export type ToggleButtonProps = {
	children: any;
	selected?: boolean;
	size?: "small" | "medium" | "large";
	color?: MuiElementColors;
	type?: "button" | "reset" | "submit";
} & Omit<MuiElementType<HTMLButtonElement>, "size">;

/**
 * Toggle button / group for exclusive or multi options (alignment, view mode).
 *
 * @example Text align
 * ```tsx
 * <ToggleButtonGroup value={align} exclusive onChange={setAlign}>
 *   <ToggleButton value="left">Left</ToggleButton>
 *   <ToggleButton value="center">Center</ToggleButton>
 * </ToggleButtonGroup>
 * ```
 */
export default function ToggleButton({
	children,
	className,
	selected,
	size = "medium",
	color,
	...props
}: ToggleButtonProps) {
	const button = useClassNames({
		component_name: "Toggle_Root",
		className,
		state: [selected && "selected", size, color],
	});
	const ref = useMuiRef(props.ref);

	const isDisabled = Boolean(props.disabled);
	return (
		<button className={button.combined} {...props} ref={ref}>
			{children}
			{!isDisabled && (
				<RippleBase ref={ref} color={color} disabled={isDisabled} />
			)}
		</button>
	);
}

type ToggleButtonGroupProps = {
	children: any;
	direction?: "row" | "column";
	size?: "small" | "medium" | "large";
	color?: MuiElementColors;
} & MuiElementType<HTMLDivElement>;

export function ToggleButtonGroup({
	children,
	direction,
	className,
	color,
	size,
	sx,
	...props
}: ToggleButtonGroupProps) {
	const _style = useStyle(sx);

	const group = useClassNames({
		component_name: "Toggle_Group_Root",
		state: [direction, size, color],
		className,
	});

	return (
		<div
			role="group"
			className={clsx(group.combined, _style.classNameFromSx)} style={_style.styleFromSx}
			{...props}
		>
			{children}
		</div>
	);
}
