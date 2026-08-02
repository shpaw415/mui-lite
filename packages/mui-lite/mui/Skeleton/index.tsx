import clsx from "clsx";
import { type CSSProperties, createElement, type JSX } from "react";
import { useClassNames, useStyle } from "../../common/theme";
import { type MuiElementType, useColorOverRide } from "../../common/utils";

export type SkeletonProps = {
	/** default: text */
	variant?: "text" | "circular" | "rectangular" | "rounded";
	element?: keyof JSX.IntrinsicElements;
	/**  default: pulse */
	animation?: "wave" | "pulse" | false;
	colorOverRide?: CSSProperties["color"];
} & MuiElementType<HTMLSpanElement>;

/**
 * Placeholder shimmer while content loads.
 *
 * @example Card loading
 * ```tsx
 * <Skeleton variant="rectangular" height={120} />
 * <Skeleton width="60%" />
 * ```
 */
export default function Skeleton({
	variant,
	className,
	colorOverRide,
	sx,
	animation = "pulse",
	element = "span",
	width,
	height,
	children,
	...props
}: SkeletonProps) {
	const style = useStyle(
		{ width, height, ...sx },
		{
			opacity: {
				backgroundColor: 0.11,
			},
		},
	);
	const root = useClassNames({
		component_name: "Skeleton_Root",
		className,
		state: [variant || "text", animation, animation === false && "none"],
	});
	const bgColorOverRide = useColorOverRide({
		colorOverRide,
	});
	return createElement(element, {
		className: clsx(root.combined, style.classNameFromSx),
		style: { ...style.styleFromSx, ...bgColorOverRide },
		children: children && (
			<div className="MUI_Skeleton_children">{children}</div>
		),
		...props,
	});
}
