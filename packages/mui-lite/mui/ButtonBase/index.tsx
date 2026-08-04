"use client";

import clsx from "clsx";
import {
	createElement,
	type ElementType,
	type MouseEventHandler,
	type ReactNode,
	useCallback,
	useState,
} from "react";
import { RippleBase } from "../../common/ripple";
import { useClassNames, useStyle } from "../../common/theme";
import {
	type MuiElementType,
	useMuiRef,
} from "../../common/utils";

export type ButtonBaseProps = {
	children?: ReactNode;
	component?: ElementType;
	disabled?: boolean;
	disableRipple?: boolean;
	centerRipple?: boolean;
	focusRipple?: boolean;
	focusVisibleClassName?: string;
	href?: string;
	LinkComponent?: ElementType;
	onFocusVisible?: React.FocusEventHandler<HTMLElement>;
	type?: "button" | "submit" | "reset";
} & Omit<MuiElementType<HTMLButtonElement>, "disabled" | "type">;

/**
 * Headless pressable surface for custom interactive elements.
 *
 * @example Custom tile
 * ```tsx
 * <ButtonBase onClick={select} sx={{ p: 2, borderRadius: 1 }}>
 *   Choose plan
 * </ButtonBase>
 * ```
 */
export default function ButtonBase({
	children,
	className,
	sx,
	component,
	disabled = false,
	disableRipple = false,
	centerRipple = false,
	focusRipple = false,
	focusVisibleClassName,
	href,
	LinkComponent = "a",
	onFocusVisible,
	onClick,
	onBlur,
	onKeyDown,
	type = "button",
	...props
}: ButtonBaseProps) {
	const [focusVisible, setFocusVisible] = useState(false);
	const ref = useMuiRef<HTMLElement>(props.ref as any);
	const style = useStyle(sx);

	const root = useClassNames({
		component_name: "ButtonBase",
		className: clsx(className, focusVisible && focusVisibleClassName),
		state: [disabled && "disabled", focusVisible && "focusVisible"],
	});

	const handleFocus = useCallback<React.FocusEventHandler<HTMLElement>>(
		(event) => {
			if (event.target.matches?.(":focus-visible")) {
				setFocusVisible(true);
				onFocusVisible?.(event);
			}
			(props as any).onFocus?.(event);
		},
		[onFocusVisible, props],
	);

	const handleBlur = useCallback<React.FocusEventHandler<HTMLElement>>(
		(event) => {
			setFocusVisible(false);
			onBlur?.(event as any);
		},
		[onBlur],
	);

	const handleClick = useCallback<MouseEventHandler<HTMLElement>>(
		(event) => {
			if (disabled) {
				event.preventDefault();
				return;
			}
			onClick?.(event as any);
		},
		[disabled, onClick],
	);

	const handleKeyDown = useCallback<React.KeyboardEventHandler<HTMLElement>>(
		(event) => {
			if (
				focusRipple &&
				!disableRipple &&
				event.key === " " &&
				focusVisible &&
				!event.repeat
			) {
				// visual focus ripple handled by CSS :focus-visible
			}
			onKeyDown?.(event as any);
		},
		[disableRipple, focusRipple, focusVisible, onKeyDown],
	);

	const Component: ElementType = href
		? LinkComponent
		: (component ?? "button");

	const isNativeButton = Component === "button" || Component === "input";

	const elementProps: Record<string, unknown> = {
		...props,
		ref,
		className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
		onClick: handleClick,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onKeyDown: handleKeyDown,
		"aria-disabled": disabled || undefined,
	};

	if (href) {
		elementProps.href = disabled ? undefined : href;
		if (disabled) elementProps.tabIndex = -1;
	} else if (isNativeButton) {
		elementProps.type = type;
		elementProps.disabled = disabled;
	} else {
		elementProps.role = elementProps.role ?? "button";
		elementProps.tabIndex = disabled ? -1 : (elementProps.tabIndex ?? 0);
	}

	return createElement(
		Component,
		elementProps,
		children,
		!disableRipple && !disabled && (
			<RippleBase
				ref={ref as React.RefObject<HTMLElement | null>}
				preventClickElement
				disabled={disabled}
				center={centerRipple}
			/>
		),
	);
}
