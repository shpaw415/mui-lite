"use client";

import {
	type ReactElement,
	cloneElement,
	useEffect,
} from "react";
import { useMuiRef } from "../../common/utils";

export type ClickAwayListenerProps = {
	children: ReactElement<{ ref?: React.Ref<HTMLElement> }>;
	onClickAway: (event: MouseEvent | TouchEvent) => void;
	mouseEvent?: "onClick" | "onMouseDown" | "onMouseUp" | false;
	touchEvent?: "onTouchStart" | "onTouchEnd" | false;
	disableReactTree?: boolean;
};

/**
 * Detects outside clicks to dismiss menus, popovers, and editors.
 *
 * @example Close popover
 * ```tsx
 * <ClickAwayListener onClickAway={() => setOpen(false)}>
 *   <div>{open && <Menu />}</div>
 * </ClickAwayListener>
 * ```
 */
export default function ClickAwayListener({
	children,
	onClickAway,
	mouseEvent = "onClick",
	touchEvent = "onTouchEnd",
}: ClickAwayListenerProps) {
	const ref = useMuiRef<HTMLElement>(children.props.ref as any);

	useEffect(() => {
		const handle = (event: MouseEvent | TouchEvent) => {
			const node = ref.current;
			if (!node) return;
			const target = event.target as Node | null;
			if (target && node.contains(target)) return;
			onClickAway(event);
		};

		const mouseType =
			mouseEvent === false
				? null
				: mouseEvent === "onMouseDown"
					? "mousedown"
					: mouseEvent === "onMouseUp"
						? "mouseup"
						: "click";
		const touchType =
			touchEvent === false
				? null
				: touchEvent === "onTouchStart"
					? "touchstart"
					: "touchend";

		if (mouseType) document.addEventListener(mouseType, handle);
		if (touchType) document.addEventListener(touchType, handle as any);
		return () => {
			if (mouseType) document.removeEventListener(mouseType, handle);
			if (touchType) document.removeEventListener(touchType, handle as any);
		};
	}, [mouseEvent, touchEvent, onClickAway, ref]);

	return cloneElement(children, {
		...children.props,
		ref,
	} as any);
}
