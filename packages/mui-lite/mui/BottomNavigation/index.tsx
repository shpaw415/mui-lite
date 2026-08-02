"use client";

import clsx from "clsx";
import {
	Children,
	createContext,
	cloneElement,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useContext,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import ButtonBase from "../ButtonBase";

type BNContext = {
	value: any;
	onChange?: (event: React.SyntheticEvent, value: any) => void;
	showLabels: boolean;
};

const BottomNavigationContext = createContext<BNContext | null>(null);

/* ─── Action ─── */

export type BottomNavigationActionProps = {
	label?: ReactNode;
	icon?: ReactNode;
	value?: any;
	showLabel?: boolean;
	disabled?: boolean;
	/** internal */
	_index?: number;
} & Omit<MuiElementType<HTMLButtonElement>, "value">;

export function BottomNavigationAction({
	label,
	icon,
	value: valueProp,
	showLabel: showLabelProp,
	disabled,
	className,
	sx,
	onClick,
	_index = 0,
	...props
}: BottomNavigationActionProps) {
	const ctx = useContext(BottomNavigationContext);
	const value = valueProp !== undefined ? valueProp : _index;
	const selected = ctx ? Object.is(ctx.value, value) : false;
	const showLabel = showLabelProp ?? ctx?.showLabels ?? selected;

	const root = useClassNames({
		component_name: "BottomNavigationAction",
		className,
		state: [
			selected && "selected",
			!showLabel && "iconOnly",
			disabled && "disabled",
		],
	});
	const style = useStyle(sx);

	return (
		<ButtonBase
			{...(props as any)}
			className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx}
			disabled={disabled}
			onClick={(e) => {
				ctx?.onChange?.(e, value);
				onClick?.(e);
			}}
		>
			{icon && <span className="MUI_BottomNavigationAction_icon">{icon}</span>}
			{label != null && (
				<span
					className={`MUI_BottomNavigationAction_label${showLabel ? " MUI_BottomNavigationAction_label_show" : ""}`}
				>
					{label}
				</span>
			)}
		</ButtonBase>
	);
}

/* ─── Root ─── */

export type BottomNavigationProps = {
	children?: ReactNode;
	value?: any;
	onChange?: (event: React.SyntheticEvent, value: any) => void;
	showLabels?: boolean;
} & Omit<MuiElementType<HTMLDivElement>, "onChange">;

export default function BottomNavigation({
	children,
	value,
	onChange,
	showLabels = false,
	className,
	sx,
	...props
}: BottomNavigationProps) {
	const root = useClassNames({
		component_name: "BottomNavigation",
		className,
	});
	const style = useStyle(sx);

	const items = Children.map(children, (child, index) => {
		if (!isValidElement(child)) return child;
		return cloneElement(child as ReactElement<any>, {
			_index: index,
			key: (child as any).key ?? index,
		});
	});

	return (
		<BottomNavigationContext value={{ value, onChange, showLabels }}>
			<div
				role="navigation"
				className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx}
				{...props}
			>
				{items}
			</div>
		</BottomNavigationContext>
	);
}
