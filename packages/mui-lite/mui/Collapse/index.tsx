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
import {
	type MuiElementType,
	useValueOverRide,
} from "../../common/utils";

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
	const [mounted, setMounted] = useState(isOpen || !unmountOnExit);
	const [entered, setEntered] = useState(isOpen);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState<string | number>(
		isOpen ? "auto" : collapsedSize,
	);

	const durationMs = timeout === "auto" ? 300 : timeout;

	useEffect(() => {
		if (isOpen) {
			setMounted(true);
			requestAnimationFrame(() => {
				const el = wrapperRef.current;
				if (!el) {
					setSize("auto");
					setEntered(true);
					return;
				}
				const measured =
					orientation === "vertical" ? el.scrollHeight : el.scrollWidth;
				setSize(measured);
				setEntered(true);
				const t = window.setTimeout(() => setSize("auto"), durationMs);
				return () => clearTimeout(t);
			});
		} else {
			const el = wrapperRef.current;
			if (el) {
				const measured =
					orientation === "vertical" ? el.scrollHeight : el.scrollWidth;
				setSize(measured);
				requestAnimationFrame(() => {
					setSize(collapsedSize);
					setEntered(false);
				});
			} else {
				setSize(collapsedSize);
				setEntered(false);
			}
			if (unmountOnExit) {
				const t = window.setTimeout(() => setMounted(false), durationMs);
				return () => clearTimeout(t);
			}
		}
	}, [isOpen, orientation, collapsedSize, durationMs, unmountOnExit]);

	const root = useClassNames({
		component_name: "Collapse_Root",
		className,
		state: [
			orientation,
			(isOpen || entered) && "open",
			entered && "entered",
			!isOpen && !entered && "hidden",
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
		orientation === "vertical"
			? { height: size }
			: { width: size };

	if (!mounted) return null;

	return createElement(
		component,
		{
			...props,
			className: clsx(root.combined, style.classNameFromSx),
			style: { ...style.styleFromSx, ...timeoutOverRide, ...sizeStyle },
		},
		<div className={wrapper.combined} ref={wrapperRef}>
			<div className={wrapperInner.combined}>{children}</div>
		</div>,
	);
}

export { Collapse };
