"use client";

import {
	type CSSProperties,
	cloneElement,
	type JSX,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { type SxProps, useClassNames, zIndex } from "../../common/theme";
import {
	MuiSSRPortal,
	type SlotProps,
	useColorOverRide,
	useMuiRef,
} from "../../common/utils";
import Box, { type BoxProps } from "../Box";
import Typography, { type MuiTypographyProps } from "../Typography";

export type TooltipPlacement = "bottom" | "left" | "right" | "top";

export type ToolTipProps = {
	placement?: TooltipPlacement;
	title: string | JSX.Element;
	open?: boolean;
	onClose?: (event: React.SyntheticEvent) => void;
	onOpen?: (event: React.SyntheticEvent) => void;
	arrow?: boolean;
	enterDelay?: number;
	leaveDelay?: number;
	disabled?: boolean;
	backgroundColor?: CSSProperties["backgroundColor"];
	offSet?: {
		x?: string | number;
		y?: string | number;
	};
	transition?: "fade" | "zoom" | "none";
	triggers?: Array<"hover" | "focus" | "click">;
	children: JSX.Element;
	/** When false, render tip in-flow (not recommended; clipped by overflow). Default true. */
	disablePortal?: boolean;
	/**
	 * When true (default), hide the tip if the anchor is not intersecting the
	 * viewport / is fully clipped by a scroll container. Prevents always-on
	 * labels (e.g. Slider valueLabelDisplay="on") from floating off-screen.
	 */
	hideWhenAnchorHidden?: boolean;
	ref?: React.RefObject<HTMLParagraphElement>;
	variant?: "light" | "dark";
	SlotProps?: SlotProps<{
		container: BoxProps<HTMLDivElement>;
	}>;
} & Omit<
	MuiTypographyProps<HTMLParagraphElement>,
	"variant" | "title" | "children"
>;

const GAP = 8;
const VIEWPORT_PAD = 8;

function parseOffset(v: string | number | undefined): number {
	if (v == null) return 0;
	if (typeof v === "number") return v;
	const n = parseFloat(v);
	return Number.isFinite(n) ? n : 0;
}

/** True when any pixel of `el` is visible in the viewport (fallback if no IO). */
export function isElementInViewport(el: Element): boolean {
	const rect = el.getBoundingClientRect();
	// Zero-size / not laid out
	if (rect.width <= 0 && rect.height <= 0) return false;
	const vw =
		typeof window !== "undefined"
			? window.innerWidth || document.documentElement.clientWidth
			: 0;
	const vh =
		typeof window !== "undefined"
			? window.innerHeight || document.documentElement.clientHeight
			: 0;
	return (
		rect.bottom > 0 && rect.right > 0 && rect.top < vh && rect.left < vw
	);
}

function computePosition(
	anchor: DOMRect,
	tipW: number,
	tipH: number,
	placement: TooltipPlacement,
	offsetX: number,
	offsetY: number,
): { top: number; left: number } {
	switch (placement) {
		case "top":
			return {
				top: anchor.top - tipH - GAP + offsetY,
				left: anchor.left + anchor.width / 2 - tipW / 2 + offsetX,
			};
		case "bottom":
			return {
				top: anchor.bottom + GAP + offsetY,
				left: anchor.left + anchor.width / 2 - tipW / 2 + offsetX,
			};
		case "left":
			return {
				top: anchor.top + anchor.height / 2 - tipH / 2 + offsetY,
				left: anchor.left - tipW - GAP + offsetX,
			};
		case "right":
			return {
				top: anchor.top + anchor.height / 2 - tipH / 2 + offsetY,
				left: anchor.right + GAP + offsetX,
			};
	}
}

function flipPlacement(
	placement: TooltipPlacement,
	pos: { top: number; left: number },
	tipW: number,
	tipH: number,
): TooltipPlacement {
	const vw = typeof window !== "undefined" ? window.innerWidth : 0;
	const vh = typeof window !== "undefined" ? window.innerHeight : 0;
	const overflow = {
		top: pos.top < VIEWPORT_PAD,
		bottom: pos.top + tipH > vh - VIEWPORT_PAD,
		left: pos.left < VIEWPORT_PAD,
		right: pos.left + tipW > vw - VIEWPORT_PAD,
	};
	if (placement === "top" && overflow.top && !overflow.bottom) return "bottom";
	if (placement === "bottom" && overflow.bottom && !overflow.top) return "top";
	if (placement === "left" && overflow.left && !overflow.right) return "right";
	if (placement === "right" && overflow.right && !overflow.left) return "left";
	return placement;
}

function clampToViewport(
	pos: { top: number; left: number },
	tipW: number,
	tipH: number,
) {
	const vw = typeof window !== "undefined" ? window.innerWidth : tipW;
	const vh = typeof window !== "undefined" ? window.innerHeight : tipH;
	return {
		top: Math.min(
			Math.max(VIEWPORT_PAD, pos.top),
			Math.max(VIEWPORT_PAD, vh - tipH - VIEWPORT_PAD),
		),
		left: Math.min(
			Math.max(VIEWPORT_PAD, pos.left),
			Math.max(VIEWPORT_PAD, vw - tipW - VIEWPORT_PAD),
		),
	};
}

/**
 * Hover/focus hint for icons, truncated text, and controls.
 *
 * Renders the tip in a portal (default) so it is not clipped by
 * `overflow: hidden` ancestors (demo cards, drawers, tables, etc.).
 * When the anchor leaves the viewport (or is fully clipped), the tip is
 * hidden even if `open` is forced true — important for Slider value labels.
 *
 * @example Icon hint
 * ```tsx
 * <ToolTip title="Delete">
 *   <IconButton aria-label="delete"><DeleteIcon /></IconButton>
 * </ToolTip>
 * ```
 */
export default function ToolTip({
	placement = "bottom",
	title,
	open,
	onClose,
	onOpen,
	className,
	arrow,
	disabled,
	enterDelay = 200,
	leaveDelay = 100,
	backgroundColor,
	color,
	offSet,
	transition,
	children,
	triggers = ["hover"],
	variant = "dark",
	disablePortal = false,
	hideWhenAnchorHidden = true,
	SlotProps,
	...props
}: ToolTipProps) {
	const isControlled = open !== undefined;
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const wantsOpen = isControlled ? Boolean(open) : uncontrolledOpen;

	const [anchorVisible, setAnchorVisible] = useState(true);
	const [resolvedPlacement, setResolvedPlacement] =
		useState<TooltipPlacement>(placement);
	const [coords, setCoords] = useState<{ top: number; left: number }>({
		top: 0,
		left: 0,
	});
	const [positioned, setPositioned] = useState(false);

	const elRef = useMuiRef<HTMLElement>(children.props?.ref);
	const toolTipRef = useMuiRef<HTMLDivElement>(props.ref as any);
	const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const offsetX = parseOffset(offSet?.x);
	const offsetY = parseOffset(offSet?.y);

	const clearTimers = useCallback(() => {
		if (enterTimerRef.current != null) {
			clearTimeout(enterTimerRef.current);
			enterTimerRef.current = null;
		}
		if (leaveTimerRef.current != null) {
			clearTimeout(leaveTimerRef.current);
			leaveTimerRef.current = null;
		}
	}, []);

	useEffect(() => () => clearTimers(), [clearTimers]);

	useEffect(() => {
		setResolvedPlacement(placement);
	}, [placement]);

	// Track whether the anchor is actually on-screen / unclipped.
	// Do not depend on `children` — it is a new element every render and would
	// reset visibility (and re-open always-on tips) on every state change.
	useEffect(() => {
		if (!hideWhenAnchorHidden) {
			setAnchorVisible(true);
			return;
		}

		let io: IntersectionObserver | null = null;
		let attachedEl: Element | null = null;
		let fallbackSync: (() => void) | null = null;
		let cancelled = false;

		const apply = (visible: boolean) => {
			if (!cancelled) setAnchorVisible(visible);
		};

		const attach = () => {
			const el = elRef.current;
			if (!el || el === attachedEl) return;
			attachedEl = el;

			if (typeof IntersectionObserver !== "undefined") {
				io?.disconnect();
				io = new IntersectionObserver(
					(entries) => {
						const entry = entries[0];
						// Any non-zero intersection counts as visible
						apply(
							Boolean(entry?.isIntersecting && entry.intersectionRatio > 0),
						);
					},
					// threshold 0 fires as soon as a single pixel enters/leaves
					{ root: null, rootMargin: "0px", threshold: 0 },
				);
				io.observe(el);
				return;
			}

			// Fallback: re-check on scroll/resize
			if (fallbackSync) {
				window.removeEventListener("scroll", fallbackSync, true);
				window.removeEventListener("resize", fallbackSync);
			}
			fallbackSync = () => apply(isElementInViewport(el));
			fallbackSync();
			window.addEventListener("scroll", fallbackSync, true);
			window.addEventListener("resize", fallbackSync);
		};

		attach();
		// Anchor ref is assigned after cloneElement commit
		const raf = requestAnimationFrame(attach);

		return () => {
			cancelled = true;
			cancelAnimationFrame(raf);
			io?.disconnect();
			if (fallbackSync) {
				window.removeEventListener("scroll", fallbackSync, true);
				window.removeEventListener("resize", fallbackSync);
			}
		};
	}, [elRef, hideWhenAnchorHidden]);

	const displayOpen =
		wantsOpen && !disabled && (hideWhenAnchorHidden ? anchorVisible : true);

	const updatePosition = useCallback(() => {
		const anchor = elRef.current;
		if (!anchor) return;
		// Never keep a clamped tip stuck on-screen when the anchor is gone
		if (hideWhenAnchorHidden && !isElementInViewport(anchor)) {
			setAnchorVisible(false);
			return;
		}

		const a = anchor.getBoundingClientRect();
		const tip = toolTipRef.current;
		const tw = tip?.offsetWidth ?? 0;
		const th = tip?.offsetHeight ?? 0;

		let place = placement;
		let pos = computePosition(a, tw, th, place, offsetX, offsetY);
		const flipped = flipPlacement(place, pos, tw, th);
		if (flipped !== place) {
			place = flipped;
			pos = computePosition(a, tw, th, place, offsetX, offsetY);
		}
		// Soft clamp only while the anchor is still visible
		pos = clampToViewport(pos, tw || 1, th || 1);
		setResolvedPlacement(place);
		setCoords(pos);
		setPositioned(true);
	}, [elRef, toolTipRef, placement, offsetX, offsetY, hideWhenAnchorHidden]);

	useLayoutEffect(() => {
		if (!displayOpen) {
			setPositioned(false);
			return;
		}
		updatePosition();
		const id = requestAnimationFrame(() => updatePosition());
		return () => cancelAnimationFrame(id);
	}, [displayOpen, title, updatePosition]);

	// Reposition on scroll/resize and when tip/anchor size changes
	useEffect(() => {
		if (!displayOpen) return;
		const onScrollOrResize = () => updatePosition();
		window.addEventListener("scroll", onScrollOrResize, true);
		window.addEventListener("resize", onScrollOrResize);

		const ro =
			typeof ResizeObserver !== "undefined"
				? new ResizeObserver(() => updatePosition())
				: null;
		if (ro) {
			if (elRef.current) ro.observe(elRef.current);
			if (toolTipRef.current) ro.observe(toolTipRef.current);
		}

		return () => {
			window.removeEventListener("scroll", onScrollOrResize, true);
			window.removeEventListener("resize", onScrollOrResize);
			ro?.disconnect();
		};
	}, [displayOpen, updatePosition, elRef, toolTipRef]);

	const showTip = useCallback(
		(e?: React.SyntheticEvent) => {
			if (disabled) return;
			if (e) onOpen?.(e);
			if (isControlled) return;
			clearTimers();
			enterTimerRef.current = setTimeout(() => {
				setUncontrolledOpen(true);
				enterTimerRef.current = null;
			}, enterDelay);
		},
		[disabled, isControlled, onOpen, enterDelay, clearTimers],
	);

	const hideTip = useCallback(
		(e?: React.SyntheticEvent) => {
			if (e) onClose?.(e);
			if (isControlled) return;
			clearTimers();
			leaveTimerRef.current = setTimeout(() => {
				setUncontrolledOpen(false);
				leaveTimerRef.current = null;
			}, leaveDelay);
		},
		[isControlled, onClose, leaveDelay, clearTimers],
	);

	useEffect(() => {
		const el = elRef.current;
		if (!el || disabled) return;

		const handlers: Array<{ type: string; fn: EventListener }> = [];
		const add = (type: string, fn: EventListener) => {
			el.addEventListener(type, fn);
			handlers.push({ type, fn });
		};

		for (const trigger of triggers) {
			switch (trigger) {
				case "click":
					add("click", (e) => {
						showTip(e as any);
						children.props?.onClick?.(e);
					});
					break;
				case "focus":
					add("focus", (e) => {
						showTip(e as any);
						children.props?.onFocus?.(e);
					});
					add("blur", (e) => {
						hideTip(e as any);
						children.props?.onBlur?.(e);
					});
					break;
				case "hover":
					add("mouseenter", (e) => {
						showTip(e as any);
						children.props?.onMouseEnter?.(e);
					});
					add("mouseleave", (e) => {
						hideTip(e as any);
						children.props?.onMouseLeave?.(e);
					});
					break;
			}
		}

		return () => {
			for (const { type, fn } of handlers) {
				el.removeEventListener(type, fn);
			}
		};
	}, [
		triggers,
		showTip,
		hideTip,
		children.props,
		elRef,
		disabled,
		isControlled,
		clearTimers,
	]);

	const transitionPairs = useMemo<[string, string]>(() => {
		switch (transition) {
			case "zoom":
				return ["MUI_Zoom_In", "MUI_Zoom_Out"];
			case "none":
				return ["", ""];
			case "fade":
			default:
				return ["MUI_Fade_In", "MUI_Fade_Out"];
		}
	}, [transition]);

	const tooltip = useClassNames({
		component_name: "Tooltip-Tip",
		className: [
			className,
			displayOpen ? transitionPairs[0] : transitionPairs[1],
			disablePortal ? "MUI_Tooltip-Tip_inline" : "MUI_Tooltip-Tip_portal",
		]
			.filter(Boolean)
			.join(" "),
		state: [
			resolvedPlacement,
			displayOpen && "open",
			arrow && "arrow",
			variant,
		],
	});

	const bgVar = useColorOverRide({
		variable: "--tooltip-background-color",
		colorOverRide: backgroundColor,
	});

	const tipNode = (
		<Typography
			role="tooltip"
			aria-hidden={!displayOpen}
			{...props}
			sx={
				{
					"--tooltip-background-color":
						variant === "dark" ? "97, 97, 97" : "255, 255, 255",
					...bgVar,
					...props.sx,
				} as SxProps
			}
			className={tooltip.combined}
			ref={toolTipRef}
			style={{
				...(props as any).style,
				...(disablePortal
					? undefined
					: {
							position: "fixed",
							top: coords.top,
							left: coords.left,
							transform: "none",
							zIndex: zIndex.tooltip ?? 1500,
							// Avoid a flash at (0,0) before the first measure / while hidden
							...(!(displayOpen && positioned)
								? { visibility: "hidden" as const }
								: {}),
						}),
			}}
		>
			{title}
		</Typography>
	);

	return (
		<Box
			{...SlotProps?.container}
			className={[
				"MUI_Tooltip-Container",
				SlotProps?.container?.className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{cloneElement(children, {
				ref: elRef,
			})}
			{/* Portaled by default so overflow:hidden parents never clip the tip */}
			{disablePortal ? tipNode : <MuiSSRPortal>{tipNode}</MuiSSRPortal>}
		</Box>
	);
}
