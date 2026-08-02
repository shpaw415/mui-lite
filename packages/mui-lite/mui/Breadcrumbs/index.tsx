"use client";

import clsx from "clsx";
import {
	Children,
	createElement,
	type ElementType,
	type ReactNode,
	useState,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

export type BreadcrumbsProps = {
	children?: ReactNode;
	component?: ElementType;
	separator?: ReactNode;
	maxItems?: number;
	itemsBeforeCollapse?: number;
	itemsAfterCollapse?: number;
	expandText?: string;
} & MuiElementType<HTMLElement>;

export default function Breadcrumbs({
	children,
	component = "nav",
	separator = "/",
	maxItems = 8,
	itemsBeforeCollapse = 1,
	itemsAfterCollapse = 1,
	expandText = "Show path",
	className,
	sx,
	...props
}: BreadcrumbsProps) {
	const [expanded, setExpanded] = useState(false);
	const root = useClassNames({
		component_name: "Breadcrumbs",
		className,
	});
	const style = useStyle(sx);

	const all = Children.toArray(children).filter(Boolean);
	let items = all;

	if (!expanded && all.length > maxItems) {
		const before = all.slice(0, itemsBeforeCollapse);
		const after = all.slice(all.length - itemsAfterCollapse);
		items = [
			...before,
			<button
				key="expand"
				type="button"
				className="MUI_Breadcrumbs_expand"
				aria-label={expandText}
				onClick={() => setExpanded(true)}
			>
				…
			</button>,
			...after,
		];
	}

	const list = items.flatMap((child, i) => {
		const li = (
			<li key={`item-${i}`} className="MUI_Breadcrumbs_li">
				{child}
			</li>
		);
		if (i === 0) return [li];
		return [
			<li
				key={`sep-${i}`}
				className="MUI_Breadcrumbs_separator"
				aria-hidden
			>
				{separator}
			</li>,
			li,
		];
	});

	return createElement(
		component,
		{
			...props,
			className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
			"aria-label": props["aria-label"] ?? "breadcrumb",
		},
		<ol className="MUI_Breadcrumbs_ol">{list}</ol>,
	);
}
