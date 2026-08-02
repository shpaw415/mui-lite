import clsx from "clsx";
import {
	createElement,
	type ElementType,
	type JSX,
	type ReactNode,
	useMemo,
	useRef,
} from "react";
import { RippleBase } from "../../common/ripple";
import { useClassNames, useStyle } from "../../common/theme";
import {
	type MuiElementType,
	PropsOverRideProvider,
	type SlotProps,
	useValueOverRide,
} from "../../common/utils";
import Box, { type BoxProps } from "../Box";
import type { MuiIconButtonProps } from "../IconButton";

export type ListProps = {
	disablePadding?: boolean;
	subheader?: ReactNode;
	component?: ElementType;
	dense?: boolean;
} & MuiElementType<HTMLUListElement>;

/**
 * Structured rows for navigation, settings, and selection lists.
 *
 * @example Settings list
 * ```tsx
 * <List>
 *   <ListItemButton>
 *     <ListItemText primary="Account" secondary="Email & security" />
 *   </ListItemButton>
 * </List>
 * ```
 */
export function List({
	sx,
	subheader,
	children,
	disablePadding,
	component = "ul",
	dense,
	className,
	...props
}: ListProps) {
	const style = useStyle(sx);
	const root = useClassNames({
		component_name: "List_Root",
		className,
		state: [dense && "dense", disablePadding && "disabled-padding"],
	});
	return createElement(component, {
		...props,
		className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
		children: (
			<>
				{subheader && (
					<div className="MUI_ListItem_SubHeader_Root">{subheader}</div>
				)}
				{children}
			</>
		),
	});
}

export type ListItemProps = {
	alignItems?: "center" | "flex-start";
	dense?: boolean;
	divider?: boolean;
	disableGutters?: boolean;
	disablePadding?: boolean;
	secondaryAction?: JSX.Element;
	component?: ElementType;
} & MuiElementType<HTMLLIElement>;

export function ListItem({
	sx,
	component = "li",
	secondaryAction,
	disableGutters,
	disablePadding,
	className,
	alignItems = "center",
	dense,
	children,
	...props
}: ListItemProps) {
	const style = useStyle(sx);
	const root = useClassNames({
		component_name: "ListItem_Root",
		className,
		state: [
			disablePadding && "disabled-padding",
			dense && "dense",
			disableGutters && "disabled-gutters",
		],
	});

	return createElement(component, {
		...props,
		className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
		children: (
			<>
				{children}
				{secondaryAction && (
					<div className="MUI_ListItem_SecondaryAction">
						<PropsOverRideProvider<MuiIconButtonProps>
							props={{
								colorOverRide: style.theme.theme == "light" ? "black" : "white",
							}}
						>
							{secondaryAction}
						</PropsOverRideProvider>
					</div>
				)}
			</>
		),
	});
}

export type ListItemButtonProps = {
	type?: HTMLButtonElement["type"];
	component?: ElementType;
} & Omit<MuiElementType<HTMLButtonElement>, "type">;

export function ListItemButton({
	className,
	sx,
	children,
	component = "button",
	selected,
	disabled,
	...props
}: ListItemButtonProps) {
	const root = useClassNames({
		className,
		component_name: "ListItemButton_Root",
		state: [selected && "selected", disabled && "disabled"],
	});
	const style = useStyle(sx);
	const ref = useRef<HTMLDivElement>(null);
	return createElement(component, {
		type: "button",
		role: "button",
		tabIndex: disabled ? -1 : 0,
		disabled,
		"aria-disabled": disabled || undefined,
		className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
		...props,
		children: (
			<>
				{children}
				{!disabled && (
					<div className="MUI_ListItemButton_ripple" ref={ref}>
						<RippleBase ref={ref} preventClickElement disabled={disabled} />
					</div>
				)}
			</>
		),
	});
}

export type ListItemIconProps = {} & MuiElementType<HTMLDivElement>;

export function ListItemIcon({ className, sx, ...props }: ListItemIconProps) {
	const classes = useMemo(
		() => `MUI_ListItemIcon_Root ${className ?? ""}`,
		[className],
	);
	const style = useStyle(sx);
	const opacityVar = useValueOverRide({
		variable: "--theme-opacity",
		valueOverRide: style.theme.theme == "light" ? "0.54" : "1",
	});
	return (
		<div
			{...props}
			className={clsx(classes, style.classNameFromSx)}
			style={{ ...style.styleFromSx, ...opacityVar }}
		/>
	);
}

export type ListItemTextProps<T extends keyof JSX.IntrinsicElements> = {
	primary: React.ReactNode;
	secondary?: React.ReactNode;
	inset?: boolean;
	SlotProps?: SlotProps<{
		primary: BoxProps<HTMLSpanElement>;
		secondary: BoxProps<HTMLParagraphElement>;
	}>;
} & MuiElementType<HTMLDivElement>;

export function ListItemText({
	className,
	sx,
	primary,
	secondary,
	children,
	inset,
	SlotProps,
	...props
}: ListItemTextProps<"span">) {
	const root = useClassNames({
		component_name: "ListItemText_Root",
		className,
		state: [inset && "inset"],
	});

	const primaryClasses = useClassNames({
		component_name: "ListItemText_Primary",
		className: SlotProps?.primary?.className,
	});

	const style = useStyle(sx);
	return (
		<div {...props} className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx}>
			<Box
				Element="span"
				{...SlotProps?.primary}
				className={primaryClasses.combined}
			>
				{primary}
			</Box>
			{secondary && (
				<Box
					Element="p"
					className={`MUI_ListItemText_Secondary ${
						SlotProps?.secondary?.className ?? ""
					}`}
				>
					{secondary}
				</Box>
			)}
			{children}
		</div>
	);
}

export type ListItemAvatarProps = MuiElementType<HTMLDivElement>;

export function ListItemAvatar({
	sx,
	className,
	...props
}: ListItemAvatarProps) {
	const style = useStyle(sx);

	return (
		<div
			className={clsx([className || "", "MUI_ListItem_Avatar_Root"].join(" "), style.classNameFromSx)} style={style.styleFromSx}
			{...props}
		/>
	);
}

export {
	default as Collapse,
	type CollapseProps,
} from "../Collapse";

export type ListItemSubHeader = MuiElementType<HTMLLIElement>;

export function ListSubheader({ sx, className, ...props }: ListItemSubHeader) {
	const root = useClassNames({
		component_name: "List_Subheader_Root",
		className,
	});
	const style = useStyle(sx);

	return <li className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx} {...props} />;
}
