import clsx from "clsx";
import { createElement, type ElementType, useMemo } from "react";
import { useClassNames, useStyle, useTheme } from "../../common/theme";
import {
	type ElevationType,
	type MuiElementType,
	useValueOverRide,
} from "../../common/utils";

export type PaperProps = {
	elevation?: ElevationType;
	variant?: "elevation" | "outlined";
	square?: boolean;
	element?: ElementType;
} & MuiElementType<HTMLDivElement>;

/**
 * Elevated surface for cards, menus, and floating panels.
 *
 * @example Panel
 * ```tsx
 * <Paper elevation={2} sx={{ p: 2 }}>Dashboard widget</Paper>
 * ```
 */
export default function Paper({
	elevation = 1,
	sx,
	className,
	variant = "elevation",
	square,
	element = "div",
	style,
	...props
}: PaperProps) {
	const theme = useTheme();
	const sxStyle = useStyle(sx);

	const calculatedOverlay = useMemo(() => {
		if (theme.theme == "light" || variant == "outlined") return "none";
		const calculatedOverlayOpacity = ((elevation * 0.165) / 24).toPrecision(3);
		return `linear-gradient(rgba(var(--bg-surface-light), ${calculatedOverlayOpacity}), rgba(var(--bg-surface-light), ${calculatedOverlayOpacity}))`;
	}, [elevation, theme.theme]);

	const overlayVariable = useValueOverRide({
		variable: "--Paper-overlay",
		valueOverRide: calculatedOverlay,
	});

	const root = useClassNames({
		component_name: "Paper_Root",
		// clsx so nested arrays/strings flatten (useClassNames joins with spaces)
		className: clsx(className, sxStyle.classNameFromSx),
		state: [elevation && `elevation${elevation}`, variant, square && "square"],
	});

	return createElement(element, {
		...props,
		className: root.combined,
		style: {
			...overlayVariable,
			...sxStyle.styleFromSx,
			...style,
		},
	});
}
