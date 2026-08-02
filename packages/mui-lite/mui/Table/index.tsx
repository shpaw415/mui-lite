"use client";

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

type TableContextValue = {
	padding: "normal" | "checkbox" | "none";
	size: "small" | "medium";
	stickyHeader: boolean;
};

const TableContext = createContext<TableContextValue>({
	padding: "normal",
	size: "medium",
	stickyHeader: false,
});

const Tablelvl2Context = createContext<"head" | "body" | "footer" | null>(
	null,
);

/* ─── Table ─── */

export type TableProps = {
	children?: ReactNode;
	component?: ElementType;
	padding?: "normal" | "checkbox" | "none";
	size?: "small" | "medium";
	stickyHeader?: boolean;
} & MuiElementType<HTMLTableElement>;

export default function Table({
	children,
	component = "table",
	padding = "normal",
	size = "medium",
	stickyHeader = false,
	className,
	sx,
	...props
}: TableProps) {
	const root = useClassNames({
		component_name: "Table",
		className,
		state: [stickyHeader && "stickyHeader", size === "small" && "size-small"],
	});
	const style = useStyle(sx);
	return (
		<TableContext value={{ padding, size, stickyHeader }}>
			{createElement(
				component,
				{ ...props, className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx },
				children,
			)}
		</TableContext>
	);
}

/* ─── TableContainer ─── */

export type TableContainerProps = {
	children?: ReactNode;
	component?: ElementType;
} & MuiElementType<HTMLDivElement>;

export function TableContainer({
	children,
	component = "div",
	className,
	sx,
	...props
}: TableContainerProps) {
	const root = useClassNames({
		component_name: "TableContainer",
		className,
	});
	const style = useStyle(sx);
	return createElement(
		component,
		{ ...props, className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx },
		children,
	);
}

/* ─── TableHead / Body / Footer ─── */

function makeSection(
	name: string,
	defaultEl: ElementType,
	variant: "head" | "body" | "footer",
) {
	return function Section({
		children,
		component = defaultEl,
		className,
		sx,
		...props
	}: {
		children?: ReactNode;
		component?: ElementType;
	} & MuiElementType<HTMLTableSectionElement>) {
		const root = useClassNames({
			component_name: name,
			className,
		});
		const style = useStyle(sx);
		return (
			<Tablelvl2Context value={variant}>
				{createElement(
					component,
					{ ...props, className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx },
					children,
				)}
			</Tablelvl2Context>
		);
	};
}

export const TableHead = makeSection("TableHead", "thead", "head");
export const TableBody = makeSection("TableBody", "tbody", "body");
export const TableFooter = makeSection("TableFooter", "tfoot", "footer");

/* ─── TableRow ─── */

export type TableRowProps = {
	children?: ReactNode;
	component?: ElementType;
	hover?: boolean;
	selected?: boolean;
} & MuiElementType<HTMLTableRowElement>;

export function TableRow({
	children,
	component = "tr",
	hover,
	selected,
	className,
	sx,
	...props
}: TableRowProps) {
	const root = useClassNames({
		component_name: "TableRow",
		className,
		state: [hover && "hover", selected && "selected"],
	});
	const style = useStyle(sx);
	return createElement(
		component,
		{ ...props, className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx },
		children,
	);
}

/* ─── TableCell ─── */

export type TableCellProps = {
	children?: ReactNode;
	component?: ElementType;
	align?: "inherit" | "left" | "center" | "right" | "justify";
	padding?: "normal" | "checkbox" | "none";
	size?: "small" | "medium";
	variant?: "head" | "body" | "footer";
	scope?: string;
	sortDirection?: "asc" | "desc" | false;
	colSpan?: number;
	rowSpan?: number;
} & MuiElementType<HTMLTableCellElement>;

export function TableCell({
	children,
	component,
	align = "inherit",
	padding: paddingProp,
	size: sizeProp,
	variant: variantProp,
	scope,
	sortDirection,
	className,
	sx,
	...props
}: TableCellProps) {
	const table = useContext(TableContext);
	const lvl2 = useContext(Tablelvl2Context);
	const variant = variantProp ?? lvl2 ?? "body";
	const padding = paddingProp ?? table.padding;
	const size = sizeProp ?? table.size;
	const Comp: ElementType =
		component ?? (variant === "head" ? "th" : "td");

	const root = useClassNames({
		component_name: "TableCell",
		className,
		state: [
			`variant-${variant}`,
			`padding-${padding}`,
			size === "small" && "size-small",
			align !== "inherit" && `align-${align}`,
			table.stickyHeader && variant === "head" && "stickyHeader",
		],
	});
	const style = useStyle(sx);

	return createElement(
		Comp,
		{
			...props,
			scope: Comp === "th" ? scope ?? "col" : scope,
			"aria-sort":
				sortDirection === "asc"
					? "ascending"
					: sortDirection === "desc"
						? "descending"
						: undefined,
			className: clsx(root.combined, style.classNameFromSx), style: style.styleFromSx,
		},
		children,
	);
}

/* ─── TableSortLabel ─── */

export type TableSortLabelProps = {
	children?: ReactNode;
	active?: boolean;
	direction?: "asc" | "desc";
	hideSortIcon?: boolean;
	onClick?: React.MouseEventHandler;
} & MuiElementType<HTMLSpanElement>;

export function TableSortLabel({
	children,
	active = false,
	direction = "asc",
	hideSortIcon = false,
	className,
	sx,
	onClick,
	...props
}: TableSortLabelProps) {
	const root = useClassNames({
		component_name: "TableSortLabel",
		className,
		state: [active && "active", `direction-${direction}`],
	});
	const style = useStyle(sx);
	return (
		<span
			role="button"
			tabIndex={0}
			className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx}
			onClick={onClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.(e as any);
				}
			}}
			{...props}
		>
			{children}
			{!hideSortIcon && (
				<svg
					className="MUI_TableSortLabel_icon"
					viewBox="0 0 24 24"
					width="18"
					height="18"
					aria-hidden
				>
					<path d="M7 10l5 5 5-5z" fill="currentColor" />
				</svg>
			)}
		</span>
	);
}
