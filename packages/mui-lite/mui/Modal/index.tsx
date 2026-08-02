"use client";

import clsx from "clsx";
import {
	type ElementType,
	type ReactElement,
	cloneElement,
	useCallback,
	useContext,
	useEffect,
	useRef,
} from "react";
import { createPortal } from "react-dom";
import {
	ThemeWrapperRefContext,
	useClassNames,
	useStyle,
	zIndex,
} from "../../common/theme";
import {
	type MuiElementType,
	type SlotProps,
	useMuiRef,
	usePreventScroll,
} from "../../common/utils";
import Backdrop, { type BackdropProps } from "../Backdrop";

export type ModalCloseReason = "escapeKeyDown" | "backdropClick";

export type ModalProps = {
	children: ReactElement;
	open: boolean;
	onClose?: (event: object, reason: ModalCloseReason) => void;
	hideBackdrop?: boolean;
	keepMounted?: boolean;
	disableEscapeKeyDown?: boolean;
	disableScrollLock?: boolean;
	disablePortal?: boolean;
	container?: Element | (() => Element | null) | null;
	component?: ElementType;
	slotProps?: SlotProps<{
		backdrop?: BackdropProps;
		root?: MuiElementType<HTMLDivElement>;
	}>;
} & Omit<MuiElementType<HTMLDivElement>, "children">;

function resolveContainer(
	container?: ModalProps["container"],
	themeWrapper?: Element | null,
): Element | null {
	if (typeof document === "undefined") return null;
	if (container) {
		return typeof container === "function" ? container() : container;
	}
	// Prefer theme wrapper so CSS variables (--bg-surface, etc.) still apply
	if (themeWrapper) return themeWrapper;
	return document.body;
}

/**
 * Low-level blocking overlay primitive (prefer Dialog for most UIs).
 *
 * @example Custom modal shell
 * ```tsx
 * <Modal open={open} onClose={onClose}>
 *   <Box sx={{ p: 3, bgcolor: "background.paper" }}>Custom body</Box>
 * </Modal>
 * ```
 */
export default function Modal({
	children,
	open,
	onClose,
	hideBackdrop = false,
	keepMounted = false,
	disableEscapeKeyDown = false,
	disableScrollLock = false,
	disablePortal = false,
	container,
	component: Component = "div",
	className,
	sx,
	slotProps,
	...props
}: ModalProps) {
	const [preventScroll, restoreScroll] = usePreventScroll();
	const rootRef = useMuiRef<HTMLDivElement>(props.ref);
	const lastActive = useRef<Element | null>(null);
	const themeWrapperRef = useContext(ThemeWrapperRefContext);
	const style = useStyle(sx);

	const root = useClassNames({
		component_name: "Modal_Root",
		className: clsx(className, slotProps?.root?.className),
		state: [open && "open", !open && "hidden"],
	});

	useEffect(() => {
		if (disableScrollLock) return;
		if (open) preventScroll();
		else restoreScroll();
		return () => restoreScroll();
	}, [open, disableScrollLock, preventScroll, restoreScroll]);

	useEffect(() => {
		if (!open) return;
		lastActive.current = document.activeElement;
		const node = rootRef.current;
		const focusable = node?.querySelector<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		);
		focusable?.focus?.();
		return () => {
			if (lastActive.current instanceof HTMLElement) {
				lastActive.current.focus?.();
			}
		};
	}, [open]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Escape" && !disableEscapeKeyDown) {
				onClose?.(event, "escapeKeyDown");
			}
		},
		[disableEscapeKeyDown, onClose],
	);

	useEffect(() => {
		if (!open) return;
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, handleKeyDown]);

	const handleBackdropClick = useCallback<
		React.MouseEventHandler<HTMLDivElement>
	>(
		(event) => {
			if (event.target !== event.currentTarget) return;
			slotProps?.backdrop?.onClick?.(event);
			onClose?.(event, "backdropClick");
		},
		[onClose, slotProps?.backdrop],
	);

	if (!open && !keepMounted) return null;
	if (typeof document === "undefined") return null;

	const content = (
		<Component
			{...props}
			{...slotProps?.root}
			ref={rootRef}
			className={clsx(root.combined, style.classNameFromSx)}
			style={{
				zIndex: zIndex.modal,
				...style.styleFromSx,
				...(slotProps?.root as any)?.style,
				visibility: open ? "visible" : "hidden",
				pointerEvents: open ? "auto" : "none",
			}}
			role="presentation"
		>
			{!hideBackdrop && (
				<Backdrop
					{...slotProps?.backdrop}
					open={open}
					onClick={handleBackdropClick}
					className={clsx(
						"MUI_Modal_backdrop",
						slotProps?.backdrop?.className,
					)}
				/>
			)}
			<div className="MUI_Modal_content">
				{cloneElement(children, {
					...(children.props as object),
				})}
			</div>
		</Component>
	);

	if (disablePortal) return content;

	const mountNode = resolveContainer(container, themeWrapperRef?.current);
	if (!mountNode) return content;
	return createPortal(content, mountNode);
}

export type { BackdropProps };
