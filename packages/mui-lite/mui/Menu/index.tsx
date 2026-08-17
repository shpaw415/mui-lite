"use client";

import clsx from "clsx";
import {
	type CSSProperties,
	type ReactNode,
	type RefObject,
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import { useClassNames, useStyle, zIndex } from "../../common/theme";
import {
	MuiSSRPortal,
	useMuiRef,
	usePreventScroll,
} from "../../common/utils";
import Paper, { type PaperProps } from "../Paper";

export type MenuProps = {
	open?: boolean;
	onClose?: () => void;
	anchorEl?: RefObject<HTMLElement | null>;
	/**
	 * Lock page scroll while open. Default false (menus should not trap scroll).
	 * Prefer Modal/Dialog for blocking overlays.
	 */
	disableScrollLock?: boolean;
	/** @deprecated use disableScrollLock — default is unlocked */
	disablePreventScroll?: boolean;
	placement?: "top" | "left" | "right" | "bottom";
	/** Close menu when the page or an ancestor scrolls (default true). Scroll inside the menu is ignored. */
	closeOnScroll?: boolean;
	children?: ReactNode;
} & Omit<PaperProps, "children">;

/**
 * Anchored action menu for overflow and contextual actions.
 *
 * @example Row actions
 * ```tsx
 * <Menu open={open} anchorEl={btnRef} onClose={onClose}>
 *   <ListItemButton onClick={edit}>Edit</ListItemButton>
 *   <ListItemButton onClick={remove}>Delete</ListItemButton>
 * </Menu>
 * ```
 */
export default function Menu({
	open = false,
	onClose,
	anchorEl,
	disableScrollLock = true,
	disablePreventScroll,
	closeOnScroll = true,
	placement = "bottom",
	className,
	children,
	sx,
	style,
	role = "menu",
	...props
}: MenuProps) {
	// unlocked by default; only lock when explicitly requested
	const scrollLocked =
		disablePreventScroll === false || disableScrollLock === false;
	const [prevent, restore] = usePreventScroll();
	const menuRef = useMuiRef<HTMLDivElement>(props.ref as any);
	const [pos, setPos] = useState<CSSProperties>({
		top: 0,
		left: 0,
		visibility: "hidden",
	});

	const updatePosition = useCallback(() => {
		const anchor = anchorEl?.current;
		const menu = menuRef.current;
		if (!open || !anchor) return;

		const a = anchor.getBoundingClientRect();
		const mw = menu?.offsetWidth ?? 0;
		const mh = menu?.offsetHeight ?? 0;
		const gap = 4;

		let top = a.bottom + gap;
		let left = a.left;

		switch (placement) {
			case "top":
				top = a.top - mh - gap;
				left = a.left;
				break;
			case "bottom":
				top = a.bottom + gap;
				left = a.left;
				break;
			case "left":
				top = a.top;
				left = a.left - mw - gap;
				break;
			case "right":
				top = a.top;
				left = a.right + gap;
				break;
		}

		const pad = 8;
		if (typeof window !== "undefined") {
			left = Math.min(Math.max(pad, left), window.innerWidth - mw - pad);
			top = Math.min(Math.max(pad, top), window.innerHeight - mh - pad);
		}

		setPos({
			position: "fixed",
			top,
			left,
			visibility: "visible",
			zIndex: zIndex.modal,
		});
	}, [open, anchorEl, placement, menuRef]);

	useLayoutEffect(() => {
		if (!open) {
			setPos((p) => ({ ...p, visibility: "hidden" }));
			return;
		}
		const id = requestAnimationFrame(() => updatePosition());
		return () => cancelAnimationFrame(id);
	}, [open, updatePosition, children]);

	// optional scroll lock (off by default)
	useEffect(() => {
		if (!scrollLocked) return;
		if (open) prevent();
		else restore();
		return () => restore();
	}, [open, scrollLocked, prevent, restore]);

	// close on outside click / escape; reposition or close on scroll
	useEffect(() => {
		if (!open) return;

		const onPointerDown = (event: MouseEvent | TouchEvent) => {
			const target = event.target as Node | null;
			const menu = menuRef.current;
			const anchor = anchorEl?.current;
			if (!target) return;
			if (menu?.contains(target)) return;
			if (anchor?.contains(target)) return;
			onClose?.();
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose?.();
		};

		const eventInMenu = (event: Event) => {
			const menu = menuRef.current;
			if (!menu) return false;
			const path =
				typeof event.composedPath === "function" ? event.composedPath() : [];
			if (path.includes(menu)) return true;
			const target = event.target;
			return target instanceof Node && menu.contains(target);
		};

		let ignorePageScroll = false;
		let ignoreTimer = 0;
		const markMenuScrollIntent = () => {
			ignorePageScroll = true;
			window.clearTimeout(ignoreTimer);
			ignoreTimer = window.setTimeout(() => {
				ignorePageScroll = false;
			}, 320);
		};

		const onScroll = (event: Event) => {
			const menu = menuRef.current;
			if (eventInMenu(event) || ignorePageScroll) return;
			if (menu?.matches(":hover")) return;
			if (closeOnScroll) onClose?.();
			else updatePosition();
		};

		const onWheel = (event: WheelEvent) => {
			if (!eventInMenu(event)) return;
			markMenuScrollIntent();
			const menu = menuRef.current;
			if (!menu) return;
			const canScroll = menu.scrollHeight > menu.clientHeight + 1;
			if (!canScroll) {
				event.preventDefault();
				return;
			}
			const up = event.deltaY < 0;
			const down = event.deltaY > 0;
			const atTop = menu.scrollTop <= 0;
			const atBottom =
				menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 1;
			if ((up && atTop) || (down && atBottom)) event.preventDefault();
		};

		const t = window.setTimeout(() => {
			document.addEventListener("mousedown", onPointerDown);
			document.addEventListener("touchstart", onPointerDown);
			document.addEventListener("keydown", onKeyDown);
		}, 0);

		window.addEventListener("resize", updatePosition);
		window.addEventListener("scroll", onScroll, true);
		window.addEventListener("wheel", onWheel, { capture: true, passive: false });

		return () => {
			clearTimeout(t);
			window.clearTimeout(ignoreTimer);
			document.removeEventListener("mousedown", onPointerDown);
			document.removeEventListener("touchstart", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("resize", updatePosition);
			window.removeEventListener("scroll", onScroll, true);
			window.removeEventListener("wheel", onWheel, true);
		};
	}, [open, onClose, anchorEl, menuRef, updatePosition, closeOnScroll]);

	const menu = useClassNames({
		component_name: "Menu_Root",
		state: [open && "open"],
		className,
	});
	const sxStyle = useStyle(sx);

	if (!open) return null;

	return (
		<MuiSSRPortal>
			<Paper
				elevation={8}
				{...props}
				ref={menuRef as any}
				className={clsx(menu.combined, sxStyle.classNameFromSx)}
				style={{
					...pos,
					minWidth: 120,
					...sxStyle.styleFromSx,
					...style,
				}}
				role={role}
			>
				{children}
			</Paper>
		</MuiSSRPortal>
	);
}
