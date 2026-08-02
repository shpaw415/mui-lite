"use client";

import clsx from "clsx";
import {
	Children,
	createContext,
	cloneElement,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import ButtonBase from "../ButtonBase";

/* ─── context ─── */

type TabsContextValue = {
	value: any;
	onChange?: (event: React.SyntheticEvent, value: any) => void;
	textColor: "primary" | "secondary" | "inherit";
	orientation: "horizontal" | "vertical";
	variant: "standard" | "scrollable" | "fullWidth";
	selectionFollowsFocus?: boolean;
};

const TabsContext = createContext<TabsContextValue | null>(null);

/* ─── Tab ─── */

export type TabProps = {
	label?: ReactNode;
	icon?: ReactNode;
	iconPosition?: "top" | "bottom" | "start" | "end";
	value?: any;
	disabled?: boolean;
	disableRipple?: boolean;
	wrapped?: boolean;
	/** internal index fallback */
	_index?: number;
} & Omit<MuiElementType<HTMLButtonElement>, "value">;

export function Tab({
	label,
	icon,
	iconPosition = "top",
	value: valueProp,
	disabled = false,
	disableRipple,
	wrapped,
	className,
	sx,
	onClick,
	_index = 0,
	...props
}: TabProps) {
	const ctx = useContext(TabsContext);
	const value = valueProp !== undefined ? valueProp : _index;
	const selected = ctx ? ctx.value === value : false;

	const root = useClassNames({
		component_name: "Tab",
		className,
		state: [
			selected && "selected",
			disabled && "disabled",
			wrapped && "wrapped",
			icon && label && "labelIcon",
			icon && label && `icon-${iconPosition}`,
			ctx?.textColor && `textColor-${ctx.textColor}`,
			ctx?.variant === "fullWidth" && "fullWidth",
		],
	});
	const style = useStyle(sx);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled) return;
		ctx?.onChange?.(e, value);
		onClick?.(e);
	};

	const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
		if (ctx?.selectionFollowsFocus && !disabled) {
			ctx.onChange?.(e, value);
		}
		(props as any).onFocus?.(e);
	};

	return (
		<ButtonBase
			{...(props as any)}
			role="tab"
			aria-selected={selected}
			tabIndex={selected ? 0 : -1}
			disabled={disabled}
			disableRipple={disableRipple}
			className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx}
			onClick={handleClick}
			onFocus={handleFocus}
		>
			{icon && iconPosition !== "end" && iconPosition !== "bottom" && (
				<span className="MUI_Tab_icon">{icon}</span>
			)}
			{label != null && <span className="MUI_Tab_label">{label}</span>}
			{icon && (iconPosition === "end" || iconPosition === "bottom") && (
				<span className="MUI_Tab_icon">{icon}</span>
			)}
		</ButtonBase>
	);
}

/* ─── Tabs ─── */

export type TabsProps = {
	children?: ReactNode;
	value?: any;
	onChange?: (event: React.SyntheticEvent, value: any) => void;
	orientation?: "horizontal" | "vertical";
	variant?: "standard" | "scrollable" | "fullWidth";
	centered?: boolean;
	indicatorColor?: "primary" | "secondary";
	textColor?: "primary" | "secondary" | "inherit";
	selectionFollowsFocus?: boolean;
	"aria-label"?: string;
	"aria-labelledby"?: string;
} & Omit<MuiElementType<HTMLDivElement>, "onChange">;

export default function Tabs({
	children,
	value,
	onChange,
	orientation = "horizontal",
	variant = "standard",
	centered = false,
	indicatorColor = "primary",
	textColor = "primary",
	selectionFollowsFocus,
	className,
	sx,
	...props
}: TabsProps) {
	const listRef = useRef<HTMLDivElement>(null);
	const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });
	const id = useId();

	const updateIndicator = useCallback(() => {
		const list = listRef.current;
		if (!list) return;
		const selected = list.querySelector(
			'.MUI_Tab:is(._selected), [aria-selected="true"]',
		) as HTMLElement | null;
		if (!selected) {
			setIndicator({ left: 0, top: 0, width: 0, height: 0 });
			return;
		}
		if (orientation === "horizontal") {
			setIndicator({
				left: selected.offsetLeft,
				top: 0,
				width: selected.offsetWidth,
				height: 2,
			});
		} else {
			setIndicator({
				left: 0,
				top: selected.offsetTop,
				width: 2,
				height: selected.offsetHeight,
			});
		}
	}, [orientation]);

	useEffect(() => {
		updateIndicator();
		window.addEventListener("resize", updateIndicator);
		return () => window.removeEventListener("resize", updateIndicator);
	}, [value, children, updateIndicator]);

	const root = useClassNames({
		component_name: "Tabs",
		className,
		state: [
			orientation,
			variant,
			centered && variant !== "scrollable" && "centered",
		],
	});
	const style = useStyle(sx);

	const ctx: TabsContextValue = {
		value,
		onChange,
		textColor,
		orientation,
		variant,
		selectionFollowsFocus,
	};

	const tabs = Children.map(children, (child, index) => {
		if (!isValidElement(child)) return child;
		return cloneElement(child as ReactElement<any>, {
			_index: index,
			key: (child as any).key ?? index,
		});
	});

	const indicatorStyle =
		orientation === "horizontal"
			? {
					left: indicator.left,
					width: indicator.width,
					bottom: 0,
					height: 2,
				}
			: {
					top: indicator.top,
					height: indicator.height,
					right: 0,
					width: 2,
				};

	return (
		<TabsContext value={ctx}>
			<div
				{...props}
				className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx}
			>
				<div
					className={`MUI_Tabs_scroller MUI_Tabs_scroller_${variant === "scrollable" ? "scrollable" : "fixed"}`}
				>
					<div
						ref={listRef}
						role="tablist"
						aria-orientation={orientation}
						aria-label={props["aria-label"]}
						aria-labelledby={props["aria-labelledby"]}
						id={id}
						className={`MUI_Tabs_list${centered ? " MUI_Tabs_list_centered" : ""}${orientation === "vertical" ? " MUI_Tabs_list_vertical" : ""}`}
					>
						{tabs}
						<span
							className={`MUI_Tabs_indicator MUI_Tabs_indicator_${indicatorColor}`}
							style={indicatorStyle}
						/>
					</div>
				</div>
			</div>
		</TabsContext>
	);
}
