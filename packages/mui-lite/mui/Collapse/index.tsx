"use client";

import clsx from "clsx";
import {
	type CSSProperties,
	createElement,
	type ElementType,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import { type MuiElementType, useValueOverRide } from "../../common/utils";

export type CollapseProps = {
	children?: ReactNode;
	/** MUI-compatible alias for open */
	in?: boolean;
	open?: boolean;
	timeout?: number | "auto";
	orientation?: "vertical" | "horizontal";
	collapsedSize?: number | string;
	component?: ElementType;
	appear?: boolean;
	unmountOnExit?: boolean;
} & Omit<MuiElementType<HTMLDivElement>, "in">;

/**
 * Animated show/hide for secondary content and expandable rows.
 *
 * Uses measured pixel heights (not height: auto) so the transition is smooth
 * and GPU-friendly without layout thrashing mid-frame.
 *
 * @example Expand details
 * ```tsx
 * <Collapse open={expanded}>
 *   <Typography>More detail…</Typography>
 * </Collapse>
 * ```
 */
export default function Collapse({
	sx,
	className,
	orientation = "vertical",
	open,
	in: inProp,
	children,
	timeout = 300,
	collapsedSize = "0px",
	component = "div",
	unmountOnExit = false,
	...props
}: CollapseProps) {
	const isOpen = open ?? inProp ?? false;
	const durationMs = timeout === "auto" ? 300 : timeout;

	const wrapperRef = useRef<HTMLDivElement>(null);
	const firstMount = useRef(true);
	const [mounted, setMounted] = useState(isOpen || !unmountOnExit);
	/** Pixel size during transition; `"auto"` only when fully open (no transition). */
	const [size, setSize] = useState<string | number>(
		isOpen ? "auto" : collapsedSize,
	);
	const [entered, setEntered] = useState(isOpen);
	/** Disable transition for the one frame that snaps auto → measured before close. */
	const [instant, setInstant] = useState(false);

	const measure = () => {
		const el = wrapperRef.current;
		if (!el) return 0;
		return orientation === "vertical" ? el.scrollHeight : el.scrollWidth;
	};

	useEffect(() => {
		// Initial mount: honor open state without animating (avoids flash)
		if (firstMount.current) {
			firstMount.current = false;
			if (isOpen) {
				setMounted(true);
				setSize("auto");
				setEntered(true);
			}
			return;
		}

		let raf1 = 0;
		let raf2 = 0;
		let timeoutId = 0;

		if (isOpen) {
			setMounted(true);
			// Start from collapsed, then animate to measured height
			setInstant(true);
			setSize(collapsedSize);
			setEntered(false);

			raf1 = requestAnimationFrame(() => {
				raf2 = requestAnimationFrame(() => {
					setInstant(false);
					const px = measure();
					setSize(px || collapsedSize);
					setEntered(true);
					timeoutId = window.setTimeout(() => {
						// After transition, free height so content can grow/shrink
						setSize("auto");
					}, durationMs);
				});
			});
		} else {
			// Snap auto → current px (no transition), then animate to collapsed
			const px = measure();
			if (px > 0 || size === "auto") {
				setInstant(true);
				setSize(px || collapsedSize);
				raf1 = requestAnimationFrame(() => {
					raf2 = requestAnimationFrame(() => {
						setInstant(false);
						setSize(collapsedSize);
						setEntered(false);
					});
				});
			} else {
				setSize(collapsedSize);
				setEntered(false);
			}

			if (unmountOnExit) {
				timeoutId = window.setTimeout(() => setMounted(false), durationMs);
			}
		}

		return () => {
			cancelAnimationFrame(raf1);
			cancelAnimationFrame(raf2);
			if (timeoutId) clearTimeout(timeoutId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run on open toggle
	}, [isOpen, orientation, collapsedSize, durationMs, unmountOnExit]);

	const root = useClassNames({
		component_name: "Collapse_Root",
		className,
		state: [
			orientation,
			(isOpen || entered) && "open",
			entered && "entered",
			!isOpen && !entered && "hidden",
			instant && "instant",
		],
	});

	const wrapper = useClassNames({ component_name: "Collapse_wrapper" });
	const wrapperInner = useClassNames({
		component_name: "Collapse_wrapper_inner",
	});
	const style = useStyle(sx);

	const timeoutOverRide = useValueOverRide({
		variable: "--collapse-timeout",
		valueOverRide: `${durationMs}ms`,
	});

	const sizeStyle: CSSProperties =
		orientation === "vertical" ? { height: size } : { width: size };

	if (!mounted) return null;

	return createElement(
		component,
		{
			...props,
			className: clsx(root.combined, style.classNameFromSx),
			style: {
				...style.styleFromSx,
				...timeoutOverRide,
				...sizeStyle,
			},
		},
		<div className={wrapper.combined} ref={wrapperRef}>
			<div className={wrapperInner.combined}>{children}</div>
		</div>,
	);
}

export { Collapse };
