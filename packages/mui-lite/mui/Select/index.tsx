"use client";

import clsx from "clsx";
import {
	type JSX,
	type KeyboardEvent as ReactKeyboardEvent,
	type MouseEvent as ReactMouseEvent,
	type RefObject,
	type SVGProps,
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { type SxProps, useClassNames, useStyle } from "../../common/theme";
import { type SlotProps, useMuiRef } from "../../common/utils";
import { List, ListItemButton, ListItemText, type ListProps } from "../List";
import Menu, { type MenuProps } from "../Menu";
import TextField, { type TextFieldProps } from "../TextField";

function ArrowDown(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...props}>
			<path fill="currentColor" d="M7 10l5 5 5-5z" />
		</svg>
	);
}

function optionLabel(
	option: JSX.Element,
	formatName?: (value: string | JSX.Element) => string,
): string {
	if (formatName) return formatName(option);
	const kids = option.props?.children;
	if (typeof kids === "string" || typeof kids === "number") return String(kids);
	if (option.props?.value != null) return String(option.props.value);
	return "";
}

export type SelectProps = {
	value?: string;
	name: string;
	onSelect?: (value: string, option: JSX.Element) => void;
	defaultValue?: string;
	children: JSX.Element[] | JSX.Element;
	SlotProps?: SlotProps<{
		/** Props for the portaled Menu paper */
		"dropdown-wrapper": MenuProps;
		"dropdown-list": ListProps;
		"end-icon": React.SVGProps<SVGSVGElement>;
	}>;
	formatName?: (value: string | JSX.Element) => string;
	sx?: SxProps;
	ref?: RefObject<HTMLInputElement>;
	/** Controlled open state */
	open?: boolean;
	/** Called when the menu should open/close */
	onOpenChange?: (open: boolean) => void;
} & Omit<TextFieldProps, "value" | "onSelect" | "defaultValue">;

function Select({
	sx,
	className,
	value,
	defaultValue,
	children: childrenProp,
	onSelect,
	SlotProps,
	name,
	formatName,
	ref,
	open: openProp,
	onOpenChange,
	disabled,
	onClick,
	onKeyDown,
	...props
}: SelectProps) {
	const children = useMemo(
		() =>
			(Array.isArray(childrenProp)
				? childrenProp
				: [childrenProp]) as JSX.Element[],
		[childrenProp],
	);

	const _style = useStyle(sx);
	const listboxId = useId();
	const rootRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLDivElement>(null);
	const fieldRef = useMuiRef<HTMLInputElement>(ref);
	const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

	const resolveLabel = useCallback(
		(val: string | undefined) => {
			if (val == null || val === "") return "";
			const option = children.find(
				(e) => String(e.props?.value) === String(val),
			);
			return option ? optionLabel(option, formatName) : String(val);
		},
		[children, formatName],
	);

	const isControlled = value !== undefined;
	const [innerValue, setInnerValue] = useState(defaultValue ?? "");
	const currentValue = isControlled ? (value as string) : innerValue;
	const [displayedValue, setDisplayedValue] = useState(() =>
		resolveLabel(defaultValue ?? value),
	);

	useEffect(() => {
		setDisplayedValue(resolveLabel(currentValue));
	}, [currentValue, resolveLabel]);

	const [innerOpen, setInnerOpen] = useState(false);
	const open = openProp ?? innerOpen;
	const setOpen = useCallback(
		(next: boolean | ((prev: boolean) => boolean)) => {
			const resolved = typeof next === "function" ? next(open) : next;
			if (openProp === undefined) setInnerOpen(resolved);
			onOpenChange?.(resolved);
		},
		[open, openProp, onOpenChange],
	);

	const measureMenuWidth = useCallback(() => {
		const el = triggerRef.current;
		if (!el) return;
		setMenuWidth(el.getBoundingClientRect().width);
	}, []);

	useLayoutEffect(() => {
		if (!open) return;
		measureMenuWidth();
		window.addEventListener("resize", measureMenuWidth);
		return () => window.removeEventListener("resize", measureMenuWidth);
	}, [open, measureMenuWidth]);

	const commitValue = useCallback(
		(child: JSX.Element, index: number) => {
			const newValue = String(child.props?.value ?? index);
			const label = optionLabel(child, formatName);
			if (!isControlled) {
				setInnerValue(newValue);
				setDisplayedValue(label);
			}
			onSelect?.(newValue, child);
			setOpen(false);
			fieldRef.current?.focus();
		},
		[formatName, isControlled, onSelect, setOpen, fieldRef],
	);

	const toggleOpen = useCallback(() => {
		if (disabled) return;
		setOpen((o) => !o);
		fieldRef.current?.focus();
	}, [disabled, setOpen, fieldRef]);

	/** Whole trigger (field + icons) toggles the menu */
	const handleTriggerClick = useCallback(
		(event: ReactMouseEvent<HTMLDivElement>) => {
			const target = event.target as HTMLElement;
			if (target.closest(".MUI_Menu_Root")) return;
			if (target.closest('button, [role="option"]')) return;
			onClick?.(event as unknown as ReactMouseEvent<HTMLInputElement>);
			if (event.defaultPrevented) return;
			toggleOpen();
		},
		[onClick, toggleOpen],
	);

	const handleFieldKeyDown = useCallback(
		(event: ReactKeyboardEvent<HTMLInputElement>) => {
			onKeyDown?.(event);
			if (disabled || event.defaultPrevented) return;
			if (
				event.key === "ArrowDown" ||
				event.key === "Enter" ||
				event.key === " "
			) {
				event.preventDefault();
				setOpen(true);
			} else if (event.key === "Escape" && open) {
				event.preventDefault();
				setOpen(false);
			}
		},
		[disabled, onKeyDown, open, setOpen],
	);

	const handleMenuClose = useCallback(() => {
		setOpen(false);
		fieldRef.current?.focus();
	}, [setOpen, fieldRef]);

	const {
		className: menuClassName,
		sx: menuSx,
		style: menuStyle,
		onClose: menuOnClose,
		...menuSlotRest
	} = SlotProps?.["dropdown-wrapper"] ?? {};

	const root = useClassNames({
		component_name: "Select_Root",
		className,
		state: [open && "open", disabled && "disabled"],
	});

	const dropDown = useClassNames({
		component_name: "Select_DropDown_Root",
		className: menuClassName,
		state: [open && "open"],
	});

	const select = useClassNames({
		component_name: "Select_Input",
	});

	return (
		<div
			ref={rootRef}
			className={clsx(root.combined, _style.classNameFromSx)}
			style={_style.styleFromSx}
		>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled on the input */}
			<div
				ref={triggerRef}
				className={select.combined}
				onClick={handleTriggerClick}
			>
				<TextField
					value={displayedValue}
					endIcon={
						<ArrowDown
							{...SlotProps?.["end-icon"]}
							className={clsx(
								"MUI_Select_DropDown_Arrow",
								SlotProps?.["end-icon"]?.className,
							)}
						/>
					}
					sx={sx}
					readOnly
					disabled={disabled}
					aria-expanded={open}
					aria-haspopup="listbox"
					aria-controls={open ? listboxId : undefined}
					{...props}
					ref={fieldRef}
					onKeyDown={handleFieldKeyDown}
				/>
			</div>
			<Menu
				{...menuSlotRest}
				open={open}
				anchorEl={triggerRef}
				placement="bottom"
				closeOnScroll
				className={dropDown.combined}
				role="presentation"
				onClose={() => {
					menuOnClose?.();
					handleMenuClose();
				}}
				sx={{
					width: menuWidth,
					minWidth: menuWidth ?? 120,
					maxWidth: "min(100vw - 16px, 560px)",
					maxHeight: "min(40vh, 320px)",
					overflowY: "auto",
					...((menuSx as object) ?? {}),
				}}
				style={menuStyle}
			>
				<List
					{...SlotProps?.["dropdown-list"]}
					id={listboxId}
					role="listbox"
					className={clsx(SlotProps?.["dropdown-list"]?.className)}
					disablePadding
				>
					{children.map((child, index) => {
						const optionValue = String(child.props?.value ?? index);
						const selected = String(currentValue) === optionValue;
						return (
							<ListItemButton
								e-value={child.props?.value}
								key={child.key ?? optionValue}
								role="option"
								aria-selected={selected}
								selected={selected}
								className={selected ? "selected" : undefined}
								tabIndex={open ? 0 : -1}
								onClick={() => commitValue(child, index)}
							>
								{typeof child.props?.children === "string" ? (
									<ListItemText primary={child.props.children} />
								) : (
									child.props?.children
								)}
							</ListItemButton>
						);
					})}
				</List>
			</Menu>
			<input
				name={name}
				type="hidden"
				value={currentValue}
				disabled={disabled}
			/>
		</div>
	);
}

export default Select;
