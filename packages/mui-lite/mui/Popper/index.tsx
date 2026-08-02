"use client";

import clsx from "clsx";
import {
	type CSSProperties,
	type ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { useClassNames, useStyle, zIndex } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

export type PopperPlacement =
	| "bottom-start"
	| "bottom"
	| "bottom-end"
	| "top-start"
	| "top"
	| "top-end"
	| "left-start"
	| "left"
	| "left-end"
	| "right-start"
	| "right"
	| "right-end"
	| "auto"
	| "auto-start"
	| "auto-end";

export type PopperProps = {
	open: boolean;
	anchorEl?: HTMLElement | null | (() => HTMLElement | null);
	children?: ReactNode | ((props: { placement: PopperPlacement }) => ReactNode);
	placement?: PopperPlacement;
	disablePortal?: boolean;
	keepMounted?: boolean;
	container?: Element | (() => Element | null) | null;
	/** gap between anchor and popper in px */
	offset?: number;
	modifiers?: unknown[];
} & Omit<MuiElementType<HTMLDivElement>, "children">;

function resolveEl(
	el?: HTMLElement | null | (() => HTMLElement | null),
): HTMLElement | null {
	if (!el) return null;
	return typeof el === "function" ? el() : el;
}

function resolveContainer(
	container?: PopperProps["container"],
): Element | null {
	if (typeof document === "undefined") return null;
	if (!container) return document.body;
	return typeof container === "function" ? container() : container;
}

function computePosition(
	anchor: DOMRect,
	popper: { width: number; height: number },
	placement: PopperPlacement,
	offset: number,
): { top: number; left: number; placement: PopperPlacement } {
	let p = placement;
	if (p.startsWith("auto")) {
		const spaceBelow = window.innerHeight - anchor.bottom;
		const spaceAbove = anchor.top;
		const vertical = spaceBelow >= spaceAbove ? "bottom" : "top";
		const align =
			p === "auto-start" ? "-start" : p === "auto-end" ? "-end" : "";
		p = `${vertical}${align}` as PopperPlacement;
	}

	const [side, align] = p.split("-") as [string, string | undefined];
	let top = 0;
	let left = 0;

	switch (side) {
		case "bottom":
			top = anchor.bottom + offset;
			break;
		case "top":
			top = anchor.top - popper.height - offset;
			break;
		case "left":
			left = anchor.left - popper.width - offset;
			break;
		case "right":
			left = anchor.right + offset;
			break;
	}

	if (side === "bottom" || side === "top") {
		if (align === "start") left = anchor.left;
		else if (align === "end") left = anchor.right - popper.width;
		else left = anchor.left + anchor.width / 2 - popper.width / 2;
	} else {
		if (align === "start") top = anchor.top;
		else if (align === "end") top = anchor.bottom - popper.height;
		else top = anchor.top + anchor.height / 2 - popper.height / 2;
	}

	// keep in viewport
	const margin = 8;
	left = Math.min(
		Math.max(margin, left),
		window.innerWidth - popper.width - margin,
	);
	top = Math.min(
		Math.max(margin, top),
		window.innerHeight - popper.height - margin,
	);

	return { top, left, placement: p };
}

export default function Popper({
	open,
	anchorEl,
	children,
	placement = "bottom",
	disablePortal = false,
	keepMounted = false,
	container,
	offset = 8,
	className,
	sx,
	style,
	...props
}: PopperProps) {
	const [coords, setCoords] = useState<{
		top: number;
		left: number;
		placement: PopperPlacement;
	} | null>(null);
	const [node, setNode] = useState<HTMLDivElement | null>(null);

	const update = useCallback(() => {
		const anchor = resolveEl(anchorEl);
		if (!anchor || !node) return;
		const a = anchor.getBoundingClientRect();
		const p = {
			width: node.offsetWidth || 0,
			height: node.offsetHeight || 0,
		};
		setCoords(computePosition(a, p, placement, offset));
	}, [anchorEl, node, placement, offset]);

	useLayoutEffect(() => {
		if (!open) return;
		update();
	}, [open, update, children]);

	useEffect(() => {
		if (!open) return;
		const onScroll = () => update();
		window.addEventListener("scroll", onScroll, true);
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll, true);
			window.removeEventListener("resize", onScroll);
		};
	}, [open, update]);

	const root = useClassNames({
		component_name: "Popper",
		className,
		state: [open && "open", coords?.placement],
	});
	const sxStyle = useStyle(sx);

	if (!open && !keepMounted) return null;
	if (typeof document === "undefined") return null;

	const content = typeof children === "function"
		? children({ placement: coords?.placement ?? placement })
		: children;

	const posStyle: CSSProperties = {
		position: "fixed",
		top: coords?.top ?? -9999,
		left: coords?.left ?? -9999,
		zIndex: zIndex.modal,
		visibility: open && coords ? "visible" : "hidden",
		pointerEvents: open ? "auto" : "none",
		...sxStyle.styleFromSx,
		...style,
	};

	const el = (
		<div
			{...props}
			ref={setNode}
			className={clsx(root.combined, sxStyle.classNameFromSx)}
			style={posStyle}
			data-popper-placement={coords?.placement}
		>
			{content}
		</div>
	);

	if (disablePortal) return el;
	const mount = resolveContainer(container);
	return mount ? createPortal(el, mount) : el;
}
