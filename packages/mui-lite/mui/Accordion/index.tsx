"use client";

import clsx from "clsx";
import {
	createContext,
	type JSX,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { type SxProps, useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import Collapse from "../Collapse";
import Paper, { type PaperProps } from "../Paper";

function ExpandMoreIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			aria-hidden
			focusable="false"
		>
			<path
				fill="currentColor"
				d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
			/>
		</svg>
	);
}

export type AccordionProps = {
	/** Controlled expanded state */
	expended?: boolean;
	/** @alias expended */
	expanded?: boolean;
	defaultExpended?: boolean;
	defaultExpanded?: boolean;
	/** Optional summary node (or pass AccordionSummary as a child) */
	Summary?: JSX.Element;
	disabled?: boolean;
	/** Collapse animation duration in ms */
	transitionDuration?: number;
	sx?: SxProps;
	onChange?: (expanded: boolean) => void;
} & PaperProps;

type ExpandedCtx = {
	expanded: boolean;
	setExpanded: (next: boolean | ((prev: boolean) => boolean)) => void;
	disabled?: boolean;
};

const ExpandedContext = createContext<ExpandedCtx>({
	expanded: false,
	setExpanded: () => {},
});

/**
 * Expandable section for FAQ, settings groups, and progressive disclosure.
 *
 * @example FAQ item
 * ```tsx
 * <Accordion>
 *   <AccordionSummary>Shipping</AccordionSummary>
 *   <AccordionDetails>We ship worldwide in 3–5 days.</AccordionDetails>
 * </Accordion>
 * ```
 */
export default function Accordion({
	expended,
	expanded: expandedProp,
	defaultExpended,
	defaultExpanded,
	children,
	Summary,
	disabled,
	className,
	transitionDuration = 300,
	onChange,
	...props
}: AccordionProps) {
	const controlled = expended ?? expandedProp;
	const isControlled = controlled !== undefined;
	const [internal, setInternal] = useState(
		Boolean(defaultExpended ?? defaultExpanded),
	);
	const expanded = isControlled ? Boolean(controlled) : internal;

	const setExpanded = useCallback(
		(next: boolean | ((prev: boolean) => boolean)) => {
			const value = typeof next === "function" ? next(expanded) : next;
			if (!isControlled) setInternal(value);
			onChange?.(value);
		},
		[expanded, isControlled, onChange],
	);

	const ctx = useMemo<ExpandedCtx>(
		() => ({ expanded, setExpanded, disabled }),
		[expanded, setExpanded, disabled],
	);

	const root = useClassNames({
		component_name: "Accordion_Root",
		className,
		state: [disabled && "disabled", expanded && "expended", expanded && "expanded"],
	});

	// Split summary children vs body when Summary prop is not used
	const childArray = Array.isArray(children)
		? children
		: children != null
			? [children]
			: [];
	let summaryNode = Summary;
	const body: typeof childArray = [];
	for (const child of childArray) {
		if (
			!summaryNode &&
			child &&
			typeof child === "object" &&
			"type" in child &&
			(child as any).type?.displayName === "AccordionSummary"
		) {
			summaryNode = child as JSX.Element;
		} else {
			body.push(child);
		}
	}

	return (
		<ExpandedContext value={ctx}>
			<Paper elevation={1} square {...props} className={root.combined}>
				{summaryNode}
				{/*
				 * Height animation via Collapse (measured px), not CSS height:auto /
				 * visibility keyframes — avoids flicker and layout thrash.
				 */}
				<Collapse
					open={expanded}
					timeout={transitionDuration}
					// Keep mounted so re-open doesn't reflow from empty
					unmountOnExit={false}
				>
					<div>{body}</div>
				</Collapse>
			</Paper>
		</ExpandedContext>
	);
}

export type AccordionSummaryProps = {
	expendIcon?: JSX.Element;
	expandIcon?: JSX.Element;
	Element?: keyof JSX.IntrinsicElements;
} & MuiElementType<HTMLHeadingElement>;

export function AccordionSummary({
	children,
	expendIcon,
	expandIcon,
	className,
	Element = "h3",
	sx,
	...props
}: AccordionSummaryProps) {
	const style = useStyle(sx);
	const { expanded, setExpanded, disabled } = useContext(ExpandedContext);
	const root = useClassNames({
		component_name: "Accordion_Summary_Root",
		className,
	});

	const btn = useClassNames({
		component_name: "Accordion_Summary_Btn",
		state: [expanded && "expended", expanded && "expanded"],
	});

	const content = useClassNames({
		component_name: "Accordion_Summary_Content",
		state: [expanded && "expended", expanded && "expanded"],
	});
	const icon = useClassNames({
		component_name: "Accordion_Summary_Icon",
		state: [expanded && "expended", expanded && "expanded"],
	});

	const iconNode = expandIcon ?? expendIcon ?? <ExpandMoreIcon />;

	return (
		<Element
			className={clsx(root.combined, style.classNameFromSx)}
			style={style.styleFromSx}
			{...(props as any)}
		>
			<button
				className={btn.combined}
				type="button"
				tabIndex={0}
				aria-expanded={expanded}
				onClick={() => setExpanded((c) => !c)}
				disabled={disabled}
			>
				<span className={content.combined}>{children}</span>
				<span className={icon.combined}>{iconNode}</span>
			</button>
		</Element>
	);
}
AccordionSummary.displayName = "AccordionSummary";

export type AccordionDetailsProps = MuiElementType<HTMLDivElement>;

export function AccordionDetails({
	className,
	sx,
	...props
}: AccordionDetailsProps) {
	const style = useStyle(sx);
	return (
		<div
			className={clsx(
				"MUI_Accordion_Details_Root",
				className,
				style.classNameFromSx,
			)}
			style={style.styleFromSx}
			{...props}
		/>
	);
}
AccordionDetails.displayName = "AccordionDetails";

export type AccordionActionProps = MuiElementType<HTMLDivElement>;

export function AccordionActions({
	className,
	sx,
	...props
}: AccordionActionProps) {
	const style = useStyle(sx);
	return (
		<div
			className={clsx(
				"MUI_Accordion_Actions_Root",
				className,
				style.classNameFromSx,
			)}
			style={style.styleFromSx}
			{...props}
		/>
	);
}
AccordionActions.displayName = "AccordionActions";
