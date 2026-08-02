"use client";

import {
	type CSSProperties,
	cloneElement,
	type JSX,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
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
	ref?: React.RefObject<HTMLParagraphElement>;
	variant?: "light" | "dark";
	SlotProps?: SlotProps<{
		container: BoxProps<HTMLDivElement>;
	}>;
} & Omit<MuiTypographyProps<HTMLParagraphElement>, "variant" | "title" | "children">;

const GAP = 8;

function parseOffset(v: string | number | undefined): number {
	if (v == null) return 0;
	if (typeof v === "number") return v;
	const n = parseFloat(v);
	return Number.isFinite(n) ? n : 0;
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
	const pad = 8;
	const vw = typeof window !== "undefined" ? window.innerWidth : 0;
	const vh = typeof window !== "undefined" ? window.innerHeight : 0;
	const overflow = {
		top: pos.top < pad,
		bottom: pos.top + tipH > vh - pad,
		left: pos.left < pad,
		right: pos.left + tipW > vw - pad,
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
	const pad = 8;
	const vw = typeof window !== "undefined" ? window.innerWidth : tipW;
	const vh = typeof window !== "undefined" ? window.innerHeight : tipH;
	return {
		top: Math.min(Math.max(pad, pos.top), Math.max(pad, vh - tipH - pad)),
		left: Math.min(Math.max(pad, pos.left), Math.max(pad, vw - tipW - pad)),
	};
}

/**
 * Hover/focus hint for icons, truncated text, and controls.
 *
 * Renders the tip in a portal (default) so it is not clipped by
 * `overflow: hidden` ancestors (demo cards, drawers, tables, etc.).
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
	enterDelay,
	leaveDelay,
	backgroundColor,
	color,
	offSet,
	transition,
	children,
	triggers = ["hover"],
	variant = "dark",
	disablePortal = false,
	SlotProps,
	...props
}: ToolTipProps) {
	const [, setEnterTimer] = useState<ReturnType<typeof setTimeout>>();
	const [active, setActive] = useState(Boolean(open));
	const [resolvedPlacement, setResolvedPlacement] =
		useState<TooltipPlacement>(placement);
	const [coords, setCoords] = useState<{ top: number; left: number }>({
		top: 0,
		left: 0,
	});

	const elRef = useMuiRef<HTMLElement>(children.props?.ref);
	const toolTipRef = useMuiRef<HTMLDivElement>(props.ref as any);

	const offsetX = parseOffset(offSet?.x);
	const offsetY = parseOffset(offSet?.y);

	// Controlled mode
	useEffect(() => {
		if (open === undefined) return;
		if (active !== open) setActive(open);
	}, [open, active]);

	useEffect(() => {
		setResolvedPlacement(placement);
	}, [placement]);

	const updatePosition = useCallback(() => {
		const anchor = elRef.current;
		if (!anchor) return;
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
		pos = clampToViewport(pos, tw || 1, th || 1);
		setResolvedPlacement(place);
		setCoords(pos);
	}, [elRef, toolTipRef, placement, offsetX, offsetY]);

	useLayoutEffect(() => {
		if (!active) return;
		updatePosition();
		// Re-measure after paint when tip has real size
		const id = requestAnimationFrame(() => updatePosition());
		return () => cancelAnimationFrame(id);
	}, [active, title, updatePosition]);

	useEffect(() => {
		if (!active) return;
		const onScrollOrResize = () => updatePosition();
		window.addEventListener("scroll", onScrollOrResize, true);
		window.addEventListener("resize", onScrollOrResize);
		return () => {
			window.removeEventListener("scroll", onScrollOrResize, true);
			window.removeEventListener("resize", onScrollOrResize);
		};
	}, [active, updatePosition]);

	const showTip = useCallback(
		(e?: React.SyntheticEvent) => {
			if (e) onOpen?.(e);
			if (disabled || open !== undefined) return;
			setEnterTimer((c) => {
				if (c) clearTimeout(c);
				return setTimeout(() => setActive(true), enterDelay ?? 200);
			});
		},
		[disabled, open, onOpen, enterDelay],
	);

	const hideTip = useCallback(
		(e?: React.SyntheticEvent) => {
			if (e) onClose?.(e);
			if (open !== undefined) return;
			setEnterTimer((c) => {
				if (c) clearTimeout(c);
				return setTimeout(() => setActive(false), leaveDelay ?? 100);
			});
		},
		[open, onClose, leaveDelay],
	);

	useEffect(() => {
		const el = elRef.current;
		if (!el) return;

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
	}, [triggers, showTip, hideTip, children.props, elRef]);

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
			active ? transitionPairs[0] : transitionPairs[1],
			disablePortal ? "MUI_Tooltip-Tip_inline" : "MUI_Tooltip-Tip_portal",
		]
			.filter(Boolean)
			.join(" "),
		state: [
			resolvedPlacement,
			active && "open",
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
