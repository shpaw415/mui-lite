import clsx from "clsx";
import {
	createContext,
	createElement,
	type ElementType,
	type ReactNode,
	useContext,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

type ImageListContextValue = {
	variant: "standard" | "woven" | "masonry" | "quilted";
	rowHeight: number | "auto";
	gap: number;
	cols: number;
};

const ImageListContext = createContext<ImageListContextValue>({
	variant: "standard",
	rowHeight: "auto",
	gap: 4,
	cols: 2,
});

/* ─── ImageList ─── */

export type ImageListProps = {
	children?: ReactNode;
	component?: ElementType;
	cols?: number;
	gap?: number;
	rowHeight?: number | "auto";
	variant?: "standard" | "woven" | "masonry" | "quilted";
} & MuiElementType<HTMLUListElement>;

export default function ImageList({
	children,
	component = "ul",
	cols = 2,
	gap = 4,
	rowHeight = "auto",
	variant = "standard",
	className,
	sx,
	style,
	...props
}: ImageListProps) {
	const root = useClassNames({
		component_name: "ImageList",
		className,
		state: [variant],
	});
	const sxStyle = useStyle(sx);

	const gridStyle =
		variant === "masonry"
			? {
					columnCount: cols,
					columnGap: gap,
				}
			: {
					display: "grid",
					gridTemplateColumns: `repeat(${cols}, 1fr)`,
					gap,
				};

	return (
		<ImageListContext value={{ variant, rowHeight, gap, cols }}>
			{createElement(
				component,
				{
					...props,
					className: clsx(root.combined, sxStyle.classNameFromSx),
					style: {
						...gridStyle,
						listStyle: "none",
						padding: 0,
						margin: 0,
						...sxStyle.styleFromSx,
						...style,
					},
				},
				children,
			)}
		</ImageListContext>
	);
}

/* ─── ImageListItem ─── */

export type ImageListItemProps = {
	children?: ReactNode;
	component?: ElementType;
	cols?: number;
	rows?: number;
} & MuiElementType<HTMLLIElement>;

export function ImageListItem({
	children,
	component = "li",
	cols = 1,
	rows = 1,
	className,
	sx,
	style,
	...props
}: ImageListItemProps) {
	const ctx = useContext(ImageListContext);
	const root = useClassNames({
		component_name: "ImageListItem",
		className,
		state: [ctx.variant],
	});
	const sxStyle = useStyle(sx);

	const itemStyle: React.CSSProperties =
		ctx.variant === "masonry"
			? { breakInside: "avoid", marginBottom: ctx.gap }
			: {
					gridColumnEnd: `span ${cols}`,
					gridRowEnd: `span ${rows}`,
					height:
						ctx.rowHeight === "auto"
							? "auto"
							: (ctx.rowHeight as number) * rows + ctx.gap * (rows - 1),
					overflow: "hidden",
				};

	return createElement(
		component,
		{
			...props,
			className: clsx(root.combined, sxStyle.classNameFromSx),
			style: { ...itemStyle, ...sxStyle.styleFromSx, ...style },
		},
		children,
	);
}

/* ─── ImageListItemBar ─── */

export type ImageListItemBarProps = {
	title?: ReactNode;
	subtitle?: ReactNode;
	actionIcon?: ReactNode;
	actionPosition?: "left" | "right";
	position?: "bottom" | "top" | "below";
} & MuiElementType<HTMLDivElement>;

export function ImageListItemBar({
	title,
	subtitle,
	actionIcon,
	actionPosition = "right",
	position = "bottom",
	className,
	sx,
	...props
}: ImageListItemBarProps) {
	const root = useClassNames({
		component_name: "ImageListItemBar",
		className,
		state: [
			`position-${position}`,
			`actionPosition-${actionPosition}`,
			title && subtitle && "titleWrapBelow",
		],
	});
	const style = useStyle(sx);

	return (
		<div className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx} {...props}>
			{actionIcon && actionPosition === "left" && (
				<div className="MUI_ImageListItemBar_actionIcon">{actionIcon}</div>
			)}
			<div className="MUI_ImageListItemBar_titleWrap">
				{title != null && (
					<div className="MUI_ImageListItemBar_title">{title}</div>
				)}
				{subtitle != null && (
					<div className="MUI_ImageListItemBar_subtitle">{subtitle}</div>
				)}
			</div>
			{actionIcon && actionPosition === "right" && (
				<div className="MUI_ImageListItemBar_actionIcon">{actionIcon}</div>
			)}
		</div>
	);
}
