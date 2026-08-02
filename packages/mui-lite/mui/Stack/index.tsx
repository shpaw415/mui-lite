import {
	Children,
	createElement,
	type CSSProperties,
	type ElementType,
	Fragment,
	type ReactNode,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

export type StackDirection =
	| "row"
	| "row-reverse"
	| "column"
	| "column-reverse";

export type StackProps = {
	children?: ReactNode;
	component?: ElementType;
	direction?: StackDirection;
	spacing?: number | string;
	divider?: ReactNode;
	useFlexGap?: boolean;
	alignItems?: CSSProperties["alignItems"];
	justifyContent?: CSSProperties["justifyContent"];
	flexWrap?: CSSProperties["flexWrap"];
} & MuiElementType<HTMLDivElement>;

function spacingToCss(spacing: number | string | undefined): string | undefined {
	if (spacing === undefined) return undefined;
	if (typeof spacing === "number") return `${spacing * 8}px`;
	return spacing;
}

export default function Stack({
	children,
	component = "div",
	direction = "column",
	spacing = 0,
	divider,
	useFlexGap = true,
	alignItems,
	justifyContent,
	flexWrap,
	className,
	sx,
	style,
	...props
}: StackProps) {
	const gap = spacingToCss(spacing);
	const sxStyle = useStyle(sx);
	const root = useClassNames({
		component_name: "Stack",
		className: [className, sxStyle.classNameFromSx],
		state: [direction, useFlexGap && "gap"],
	});

	const childArray = Children.toArray(children).filter(Boolean);
	const content =
		divider != null
			? childArray.flatMap((child, i) =>
					i === 0
						? [child]
						: [
								// biome-ignore lint/suspicious/noArrayIndexKey: stable sibling dividers
								createElement(Fragment, { key: `d-${i}` }, divider),
								child,
							],
				)
			: childArray;

	const gapStyle: CSSProperties = useFlexGap
		? { gap }
		: direction.startsWith("row")
			? { ["--stack-spacing" as string]: gap }
			: { ["--stack-spacing" as string]: gap };

	return createElement(
		component,
		{
			...props,
			className: root.combined,
			style: {
				flexDirection: direction,
				alignItems,
				justifyContent,
				flexWrap,
				...gapStyle,
				...sxStyle.styleFromSx,
				...style,
			},
		},
		content,
	);
}
