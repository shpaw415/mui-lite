import { createElement, type ElementType, type ReactNode } from "react";
import {
	type MediaQueryType,
	useClassNames,
	useStyle,
} from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

export type ContainerMaxWidth = keyof MediaQueryType | false;

export type ContainerProps = {
	children?: ReactNode;
	component?: ElementType;
	disableGutters?: boolean;
	fixed?: boolean;
	maxWidth?: ContainerMaxWidth;
} & MuiElementType<HTMLDivElement>;

/**
 * Centered max-width page column for readable layouts.
 *
 * @example Page body
 * ```tsx
 * <Container maxWidth="md">
 *   <Typography variant="h4">Docs</Typography>
 * </Container>
 * ```
 */
export default function Container({
	children,
	component = "div",
	disableGutters = false,
	fixed = false,
	maxWidth = "lg",
	className,
	sx,
	...props
}: ContainerProps) {
	const maxWidthKey =
		maxWidth === false ? "false" : maxWidth === undefined ? "lg" : maxWidth;

	const style = useStyle(sx);
	const root = useClassNames({
		component_name: "Container",
		className: [className, style.classNameFromSx],
		state: [
			disableGutters && "disableGutters",
			fixed && "fixed",
			maxWidth !== false && `maxWidth-${maxWidthKey}`,
		],
	});

	return createElement(
		component,
		{
			...props,
			className: root.combined,
			style: style.styleFromSx,
		},
		children,
	);
}
