import clsx from "clsx";
import type { ReactNode } from "react";
import { useClassNames, useStyle, zIndex } from "../../common/theme";
import type { ElevationType, MuiElementType } from "../../common/utils";
import Paper from "../Paper";

export type AppBarProps = {
	children?: ReactNode;
	color?:
		| "default"
		| "inherit"
		| "primary"
		| "secondary"
		| "transparent"
		| "error"
		| "info"
		| "success"
		| "warning";
	position?: "absolute" | "fixed" | "relative" | "static" | "sticky";
	elevation?: ElevationType;
	square?: boolean;
	enableColorOnDark?: boolean;
} & Omit<MuiElementType<HTMLElement>, "color">;

/**
 * Top application chrome for titles, navigation, and actions.
 *
 * @example App header
 * ```tsx
 * <AppBar position="static">
 *   <Toolbar>
 *     <Typography variant="h6">Dashboard</Typography>
 *   </Toolbar>
 * </AppBar>
 * ```
 */
export default function AppBar({
	children,
	color = "primary",
	position = "fixed",
	elevation = 4,
	square = true,
	enableColorOnDark,
	className,
	sx,
	style,
	...props
}: AppBarProps) {
	const root = useClassNames({
		component_name: "AppBar",
		className,
		state: [`color-${color}`, `position-${position}`, enableColorOnDark && "colorOnDark"],
	});
	const sxStyle = useStyle(sx);

	return (
		<Paper
			{...(props as any)}
			element="header"
			elevation={position === "fixed" || position === "sticky" ? elevation : 0}
			square={square}
			className={clsx(root.combined, sxStyle.classNameFromSx)}
			style={{
				zIndex: position === "fixed" || position === "sticky" ? zIndex.appBar : undefined,
				...sxStyle.styleFromSx,
				...style,
			}}
		>
			{children}
		</Paper>
	);
}
