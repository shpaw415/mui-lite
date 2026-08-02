"use client";

import {
	type CSSProperties,
	type RefObject,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { type SwipeOptions, useSwipe } from "../../common/swipe";
import { useClassNames, useStyle, zIndex } from "../../common/theme";
import {
	MuiSSRPortal,
	type SlotProps,
	usePreventScroll,
} from "../../common/utils";
import Backdrop, { type BackdropProps } from "../Backdrop";
import Paper, { type PaperProps } from "../Paper";

const TRANSITION_MS = 225;
const EASING = "cubic-bezier(0, 0, 0.2, 1)";

export type DrawerProps = {
	open?: boolean;
	variant?: "permanent" | "persistent" | "temporary";
	children?: React.ReactNode;
	SlotProps?: SlotProps<{
		backdrop: BackdropProps;
	}>;
	hideBackdrop?: boolean;
	/** Keep temporary drawer mounted while closed. Default false. */
	keepMounted?: boolean;
	/** Portal temporary drawer (default true). */
	disablePortal?: boolean;
	anchor?: "bottom" | "left" | "right" | "top";
	onClose?: () => void;
	onOpen?: () => void;
	swipeOptions?: {
		options?: SwipeOptions;
		ref?: RefObject<HTMLElement | null>;
	};
	width?: CSSProperties["width"];
	minifiedWidth?: CSSProperties["width"];
} & Partial<Omit<PaperProps, "variant" | "children">>;

function toCssSize(value: CSSProperties["width"] | undefined, fallback: string) {
	if (value == null || value === "") return fallback;
	if (typeof value === "number") return `${value}px`;
	return String(value);
}

function slideTransform(
	anchor: NonNullable<DrawerProps["anchor"]>,
	visible: boolean,
): string {
	if (visible) return "translate(0, 0)";
	switch (anchor) {
		case "right":
			return "translateX(100%)";
		case "top":
			return "translateY(-100%)";
		case "bottom":
			return "translateY(100%)";
		default:
			return "translateX(-100%)";
	}
}

/** Inline geometry — independent of drawer.css */
function temporaryGeometry(
	anchor: NonNullable<DrawerProps["anchor"]>,
	visible: boolean,
	widthCss: string,
): CSSProperties {
	const base: CSSProperties = {
		position: "fixed",
		zIndex: zIndex.drawer + 2,
		display: "flex",
		flexDirection: "column",
		boxSizing: "border-box",
		outline: "none",
		margin: 0,
		backgroundColor: "rgb(var(--bg-surface, 255, 255, 255))",
		color: "rgba(var(--text-main, 0, 0, 0), 0.87)",
		boxShadow:
			"0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
		transition: `transform ${TRANSITION_MS}ms ${EASING}`,
		// stay painted while sliding out
		visibility: "visible",
		pointerEvents: visible ? "auto" : "none",
		transform: slideTransform(anchor, visible),
		willChange: "transform",
	};

	switch (anchor) {
		case "right":
			return {
				...base,
				top: 0,
				right: 0,
				bottom: 0,
				height: "100%",
				width: widthCss,
				maxWidth: "100vw",
			};
		case "top":
			return {
				...base,
				top: 0,
				left: 0,
				right: 0,
				width: "100%",
				maxHeight: "100%",
			};
		case "bottom":
			return {
				...base,
				bottom: 0,
				left: 0,
				right: 0,
				width: "100%",
				maxHeight: "100%",
			};
		default:
			return {
				...base,
				top: 0,
				left: 0,
				bottom: 0,
				height: "100%",
				width: widthCss,
				maxWidth: "100vw",
			};
	}
}

const useIsoLayoutEffect =
	typeof document !== "undefined" ? useLayoutEffect : useEffect;

export default function Drawer({
	open = false,
	variant = "temporary",
	anchor = "left",
	SlotProps,
	hideBackdrop = false,
	keepMounted = false,
	disablePortal = false,
	swipeOptions,
	onClose,
	onOpen,
	width = 240,
	minifiedWidth,
	children,
	className,
	sx,
	style,
	...props
}: DrawerProps) {
	const isTemporary = variant === "temporary";

	/**
	 * mounted  — in the DOM (portal)
	 * visible  — transform at open position (drives CSS transition)
	 *
	 * open:  mount → paint closed → next frames set visible
	 * close: visible=false → wait TRANSITION_MS → unmount
	 */
	const [mounted, setMounted] = useState(!!open || keepMounted);
	const [visible, setVisible] = useState(false);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const openRaf = useRef<number[]>([]);
	const prevOpen = useRef(open);

	// Mount immediately when opening (same render) so layoutEffect can animate
	if (open && !mounted) {
		setMounted(true);
	}
	if (keepMounted && !mounted) {
		setMounted(true);
	}

	const clearTimers = () => {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
		for (const id of openRaf.current) cancelAnimationFrame(id);
		openRaf.current = [];
	};

	useIsoLayoutEffect(() => {
		const wasOpen = prevOpen.current;
		prevOpen.current = open;
		clearTimers();

		if (open) {
			// Always enter from the closed transform when opening
			if (!wasOpen) {
				setVisible(false);
				const id1 = requestAnimationFrame(() => {
					const id2 = requestAnimationFrame(() => setVisible(true));
					openRaf.current.push(id2);
				});
				openRaf.current.push(id1);
			} else {
				setVisible(true);
			}
			return clearTimers;
		}

		// Closing: slide out, then unmount
		setVisible(false);
		if (!keepMounted && wasOpen) {
			closeTimer.current = setTimeout(() => {
				setMounted(false);
				closeTimer.current = null;
			}, TRANSITION_MS + 25);
		}

		return clearTimers;
	}, [open, keepMounted]);

	const root = useClassNames({
		component_name: "Drawer_Root",
		className,
		state: [
			(isTemporary ? visible : open) && "open",
			variant,
			anchor,
			minifiedWidth != null && "minified",
		],
	});
	const sxStyle = useStyle(sx);

	const bodyRef = useRef<HTMLElement | null>(
		typeof document !== "undefined" ? document.body : null,
	);

	useSwipe(
		swipeOptions?.ref || bodyRef,
		{
			swipeStatus(direction) {
				switch (anchor) {
					case "left":
						if (direction === "right") onOpen?.();
						break;
					case "right":
						if (direction === "left") onOpen?.();
						break;
					default:
						break;
				}
			},
			...swipeOptions?.options,
		},
		[anchor],
		!swipeOptions || anchor === "bottom" || anchor === "top",
	);

	const [prevent, restore] = usePreventScroll();

	useEffect(() => {
		if (!isTemporary) return;
		if (open) prevent();
		else restore();
		return () => restore();
	}, [open, isTemporary, prevent, restore]);

	// permanent / persistent always render
	if (isTemporary && !mounted && !keepMounted) {
		return null;
	}

	const widthCss = toCssSize(width, "240px");
	const closedWidthCss = toCssSize(minifiedWidth, "0px");

	const geometry: CSSProperties = isTemporary
		? temporaryGeometry(anchor, visible, widthCss)
		: {
				["--width" as string]: widthCss,
				["--closed-width" as string]: closedWidthCss,
				width: open ? widthCss : closedWidthCss,
				minWidth: open ? widthCss : 0,
				overflow: "hidden",
				transition: `width ${TRANSITION_MS}ms ${EASING}`,
				visibility: open || keepMounted ? "visible" : "hidden",
			};

	const paper = (
		<Paper
			elevation={isTemporary ? 16 : 0}
			square
			{...props}
			className={[root.combined, sxStyle.classNameFromSx]
				.filter(Boolean)
				.join(" ")}
			style={{
				["--width" as string]: widthCss,
				["--closed-width" as string]: closedWidthCss,
				...geometry,
				...sxStyle.styleFromSx,
				...style,
			}}
			role={isTemporary ? "dialog" : "navigation"}
			aria-modal={isTemporary ? open : undefined}
			aria-hidden={isTemporary ? !visible : undefined}
		>
			{children}
		</Paper>
	);

	const node = (
		<>
			{isTemporary && !hideBackdrop && (
				<Backdrop
					// stay up during exit slide (visible lags open=false by transition)
					open={open || visible}
					{...SlotProps?.backdrop}
					onClick={(e) => {
						SlotProps?.backdrop?.onClick?.(e);
						onClose?.();
					}}
					style={{
						zIndex: zIndex.drawer,
						transition: `opacity ${TRANSITION_MS}ms ${EASING}`,
						...SlotProps?.backdrop?.style,
					}}
				/>
			)}
			{paper}
		</>
	);

	if (isTemporary && !disablePortal) {
		return <MuiSSRPortal>{node}</MuiSSRPortal>;
	}

	return node;
}
