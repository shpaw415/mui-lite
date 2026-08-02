"use client";

import clsx from "clsx";
import {
	createElement,
	type ElementType,
	type ReactNode,
} from "react";
import { RippleBase } from "../../common/ripple";
import { useClassNames, useStyle } from "../../common/theme";
import {
	type ElevationType,
	type MuiElementType,
	useMuiRef,
} from "../../common/utils";
import Paper, { type PaperProps } from "../Paper";
import Typography from "../Typography";

/* ─── Card ─── */

export type CardProps = {
	children?: ReactNode;
	raised?: boolean;
} & PaperProps;

export default function Card({
	children,
	raised = false,
	elevation,
	className,
	...props
}: CardProps) {
	const root = useClassNames({
		component_name: "Card",
		className,
		state: [raised && "raised"],
	});
	return (
		<Paper
			{...props}
			elevation={raised ? 8 : (elevation ?? 1)}
			className={root.combined}
		>
			{children}
		</Paper>
	);
}

/* ─── CardHeader ─── */

export type CardHeaderProps = {
	avatar?: ReactNode;
	action?: ReactNode;
	title?: ReactNode;
	subheader?: ReactNode;
	disableTypography?: boolean;
	component?: ElementType;
} & MuiElementType<HTMLDivElement>;

export function CardHeader({
	avatar,
	action,
	title,
	subheader,
	disableTypography = false,
	component = "div",
	className,
	sx,
	...props
}: CardHeaderProps) {
	const root = useClassNames({
		component_name: "CardHeader",
		className,
	});
	const style = useStyle(sx);

	const titleNode =
		title == null || disableTypography || typeof title !== "string" ? (
			title
		) : (
			<Typography Element="span" className="MUI_CardHeader_title">
				{title}
			</Typography>
		);

	const subheaderNode =
		subheader == null ||
		disableTypography ||
		typeof subheader !== "string" ? (
			subheader
		) : (
			<Typography Element="span" className="MUI_CardHeader_subheader">
				{subheader}
			</Typography>
		);

	return createElement(
		component,
		{
			...props,
			className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
		},
		avatar && <div className="MUI_CardHeader_avatar">{avatar}</div>,
		<div className="MUI_CardHeader_content">
			{titleNode}
			{subheaderNode}
		</div>,
		action && <div className="MUI_CardHeader_action">{action}</div>,
	);
}

/* ─── CardMedia ─── */

export type CardMediaProps = {
	component?: ElementType;
	image?: string;
	src?: string;
	alt?: string;
	title?: string;
	children?: ReactNode;
} & MuiElementType<HTMLDivElement>;

export function CardMedia({
	component,
	image,
	src,
	alt,
	title,
	children,
	className,
	sx,
	style,
	...props
}: CardMediaProps) {
	const isMedia =
		component === "img" ||
		component === "video" ||
		component === "audio" ||
		component === "picture" ||
		component === "iframe";
	const Comp: ElementType = component ?? (image || src ? "div" : "div");
	const root = useClassNames({
		component_name: "CardMedia",
		className,
		state: [isMedia && "media"],
	});
	const sxStyle = useStyle(sx);

	const bg =
		!isMedia && (image || src)
			? {
					backgroundImage: `url(${image || src})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}
			: {};

	return createElement(Comp, {
		...props,
		className: clsx(root.combined, sxStyle.classNameFromSx),
		style: { ...bg, ...sxStyle.styleFromSx, ...style },
		src: isMedia ? src || image : undefined,
		alt: Comp === "img" ? alt : undefined,
		title,
		children: isMedia ? undefined : children,
	});
}

/* ─── CardContent ─── */

export type CardContentProps = {
	children?: ReactNode;
	component?: ElementType;
} & MuiElementType<HTMLDivElement>;

export function CardContent({
	children,
	component = "div",
	className,
	sx,
	...props
}: CardContentProps) {
	const root = useClassNames({
		component_name: "CardContent",
		className,
	});
	const style = useStyle(sx);
	return createElement(
		component,
		{ ...props, className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx },
		children,
	);
}

/* ─── CardActions ─── */

export type CardActionsProps = {
	children?: ReactNode;
	disableSpacing?: boolean;
} & MuiElementType<HTMLDivElement>;

export function CardActions({
	children,
	disableSpacing = false,
	className,
	sx,
	...props
}: CardActionsProps) {
	const root = useClassNames({
		component_name: "CardActions",
		className,
		state: [disableSpacing && "disableSpacing"],
	});
	const style = useStyle(sx);
	return (
		<div className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx} {...props}>
			{children}
		</div>
	);
}

/* ─── CardActionArea ─── */

export type CardActionAreaProps = {
	children?: ReactNode;
	component?: ElementType;
	href?: string;
	disableRipple?: boolean;
} & MuiElementType<HTMLButtonElement>;

export function CardActionArea({
	children,
	component,
	href,
	disableRipple,
	className,
	sx,
	onClick,
	...props
}: CardActionAreaProps) {
	const Comp: ElementType = href ? "a" : (component ?? "button");
	const ref = useMuiRef<HTMLElement>(props.ref as any);
	const root = useClassNames({
		component_name: "CardActionArea",
		className,
	});
	const style = useStyle(sx);

	return createElement(
		Comp,
		{
			...props,
			ref,
			href,
			type: Comp === "button" ? "button" : undefined,
			className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
			onClick,
		},
		children,
		!disableRipple && (
			<RippleBase ref={ref as any} preventClickElement />
		),
	);
}
