"use client";
import clsx from "clsx";
import type { JSX } from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementColors, MuiElementType } from "../../common/utils";

export type TypographyVariant =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "subtitle1"
	| "subtitle2"
	| "body1"
	| "body2"
	| "caption"
	| "button"
	| "overline";

const VARIANT_ELEMENTS: Record<TypographyVariant, keyof JSX.IntrinsicElements> =
	{
		h1: "h1",
		h2: "h2",
		h3: "h3",
		h4: "h4",
		h5: "h5",
		h6: "h6",
		subtitle1: "h6",
		subtitle2: "h6",
		body1: "p",
		body2: "p",
		caption: "span",
		button: "span",
		overline: "span",
	};

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

export type MuiTypographyProps<T extends HTMLElement> = {
	/** Semantic HTML tag (defaults from `variant`) */
	Element?: keyof JSX.IntrinsicElements;
	/** MUI-compatible alias for Element */
	component?: keyof JSX.IntrinsicElements;
	/** Type scale variant — drives font size/weight (beats Tailwind preflight) */
	variant?: TypographyVariant;
	color?: MuiElementColors | "textSecondary" | "text-secondary";
	align?: "inherit" | "left" | "center" | "right" | "justify";
	gutterBottom?: boolean;
	noWrap?: boolean;
	paragraph?: boolean;
} & MuiElementType<T>;

/**
 * Theme-aware text styles (h1–body, captions, overlines).
 *
 * @example Page title
 * ```tsx
 * <Typography variant="h4" component="h1">Dashboard</Typography>
 * ```
 *
 * @example Colored body
 * ```tsx
 * <Typography color="primary">Highlighted body</Typography>
 * ```
 */
export default function Typography<T>({
	children,
	Element,
	component,
	variant,
	className,
	sx,
	color,
	align,
	gutterBottom,
	noWrap,
	paragraph,
	...props
}: //@ts-ignore
MuiTypographyProps<T>) {
	// Infer variant from Element when using <Typography Element="h1">
	const resolvedVariant: TypographyVariant =
		variant ??
		(Element && HEADING_TAGS.has(Element)
			? (Element as TypographyVariant)
			: component && HEADING_TAGS.has(component)
				? (component as TypographyVariant)
				: paragraph
					? "body1"
					: "body1");

	const El = (Element ??
		component ??
		VARIANT_ELEMENTS[resolvedVariant] ??
		"p") as keyof JSX.IntrinsicElements;

	const _style = useStyle(sx);
	const root = useClassNames({
		component_name: "Typography_Root",
		className,
		state: [
			resolvedVariant,
			`variant-${resolvedVariant}`,
			color,
			align && align !== "inherit" && `align-${align}`,
			gutterBottom && "gutterBottom",
			noWrap && "noWrap",
			paragraph && "paragraph",
		],
	});

	return (
		<El
			className={clsx(root.combined, _style.classNameFromSx)}
			style={_style.styleFromSx}
			{...(props as any)}
		>
			{children}
		</El>
	);
}
