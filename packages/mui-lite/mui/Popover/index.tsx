"use client";

import clsx from "clsx";
import {
	type CSSProperties,
	type ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { useClassNames, useStyle, zIndex } from "../../common/theme";
import type { ElevationType, MuiElementType, SlotProps } from "../../common/utils";
import Modal, { type ModalCloseReason, type ModalProps } from "../Modal";
import Paper, { type PaperProps } from "../Paper";

export type Origin = {
	vertical: "top" | "center" | "bottom" | number;
	horizontal: "left" | "center" | "right" | number;
};

export type PopoverProps = {
	open: boolean;
	anchorEl?: HTMLElement | null | (() => HTMLElement | null);
	anchorOrigin?: Origin;
	transformOrigin?: Origin;
	anchorPosition?: { top: number; left: number };
	anchorReference?: "anchorEl" | "anchorPosition" | "none";
	children?: ReactNode;
	onClose?: (event: object, reason: ModalCloseReason) => void;
	elevation?: ElevationType;
	marginThreshold?: number;
	disableScrollLock?: boolean;
	keepMounted?: boolean;
	slotProps?: SlotProps<{
		paper?: PaperProps;
		root?: MuiElementType<HTMLDivElement>;
	}>;
} & Omit<ModalProps, "children" | "onClose" | "slotProps">;

function resolveEl(
	el?: HTMLElement | null | (() => HTMLElement | null),
): HTMLElement | null {
	if (!el) return null;
	return typeof el === "function" ? el() : el;
}

function originOffset(
	size: number,
	origin: "top" | "center" | "bottom" | "left" | "right" | number,
) {
	if (typeof origin === "number") return origin;
	if (origin === "center") return size / 2;
	if (origin === "bottom" || origin === "right") return size;
	return 0;
}

/**
 * Anchored modal surface for pickers and lightweight overlays.
 *
 * @example Color picker shell
 * ```tsx
 * <Popover open={open} anchorEl={anchor} onClose={onClose}>
 *   <Box sx={{ p: 2 }}>Picker content</Box>
 * </Popover>
 * ```
 */
export default function Popover({
	open,
	anchorEl,
	anchorOrigin = { vertical: "bottom", horizontal: "left" },
	transformOrigin = { vertical: "top", horizontal: "left" },
	anchorPosition,
	anchorReference = "anchorEl",
	children,
	onClose,
	elevation = 8,
	marginThreshold = 16,
	disableScrollLock,
	keepMounted,
	className,
	sx,
	slotProps,
	...modalProps
}: PopoverProps) {
	const paperRef = useRef<HTMLDivElement | null>(null);
	const [pos, setPos] = useState<CSSProperties>({
		top: 0,
		left: 0,
		visibility: "hidden",
	});

	const updatePosition = useCallback(() => {
		if (!open) return;
		const paper = paperRef.current;
		const pw = paper?.offsetWidth ?? 0;
		const ph = paper?.offsetHeight ?? 0;

		let anchorTop = 0;
		let anchorLeft = 0;
		let aw = 0;
		let ah = 0;

		if (anchorReference === "anchorPosition" && anchorPosition) {
			anchorTop = anchorPosition.top;
			anchorLeft = anchorPosition.left;
		} else if (anchorReference === "none") {
			anchorTop = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
			anchorLeft = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
		} else {
			const el = resolveEl(anchorEl);
			if (!el) return;
			const r = el.getBoundingClientRect();
			anchorTop = r.top;
			anchorLeft = r.left;
			aw = r.width;
			ah = r.height;
		}

		const aY = originOffset(ah, anchorOrigin.vertical);
		const aX = originOffset(aw, anchorOrigin.horizontal);
		const tY = originOffset(ph, transformOrigin.vertical);
		const tX = originOffset(pw, transformOrigin.horizontal);

		let top = anchorTop + aY - tY;
		let left = anchorLeft + aX - tX;

		if (marginThreshold != null && typeof window !== "undefined") {
			top = Math.min(
				Math.max(marginThreshold, top),
				window.innerHeight - ph - marginThreshold,
			);
			left = Math.min(
				Math.max(marginThreshold, left),
				window.innerWidth - pw - marginThreshold,
			);
		}

		setPos((prev) => {
			if (
				prev.top === top &&
				prev.left === left &&
				prev.visibility === "visible"
			) {
				return prev;
			}
			return {
				position: "fixed",
				top,
				left,
				visibility: "visible",
				transformOrigin: `${
					typeof transformOrigin.horizontal === "number"
						? `${transformOrigin.horizontal}px`
						: transformOrigin.horizontal
				} ${
					typeof transformOrigin.vertical === "number"
						? `${transformOrigin.vertical}px`
						: transformOrigin.vertical
				}`,
			};
		});
	}, [
		open,
		anchorEl,
		anchorOrigin.vertical,
		anchorOrigin.horizontal,
		transformOrigin.vertical,
		transformOrigin.horizontal,
		anchorPosition,
		anchorReference,
		marginThreshold,
	]);

	useLayoutEffect(() => {
		if (open) {
			// double rAF so paper has laid out
			const id = requestAnimationFrame(() => updatePosition());
			return () => cancelAnimationFrame(id);
		}
		setPos((p) =>
			p.visibility === "hidden" ? p : { ...p, visibility: "hidden" },
		);
	}, [open, updatePosition, children]);

	useEffect(() => {
		if (!open) return;
		const handler = () => updatePosition();
		window.addEventListener("resize", handler);
		window.addEventListener("scroll", handler, true);
		return () => {
			window.removeEventListener("resize", handler);
			window.removeEventListener("scroll", handler, true);
		};
	}, [open, updatePosition]);

	const root = useClassNames({
		component_name: "Popover",
		className,
		state: [open && "open"],
	});
	const style = useStyle(sx);

	return (
		<Modal
			{...modalProps}
			open={open}
			onClose={onClose}
			keepMounted={keepMounted}
			disableScrollLock={disableScrollLock}
			hideBackdrop={modalProps.hideBackdrop ?? false}
			className={clsx(root.combined, style.classNameFromSx)}
			sx={sx}
			slotProps={{
				root: slotProps?.root,
			}}
		>
			<div
				className="MUI_Popover_paperWrap"
				style={{
					...pos,
					zIndex: zIndex.modal + 1,
					...style.styleFromSx,
				}}
			>
				<Paper
					{...slotProps?.paper}
					ref={paperRef as any}
					elevation={elevation}
					className={[
						"MUI_Popover_paper",
						slotProps?.paper?.className ?? "",
					].join(" ")}
					onClick={(e) => e.stopPropagation()}
				>
					{children}
				</Paper>
			</div>
		</Modal>
	);
}
