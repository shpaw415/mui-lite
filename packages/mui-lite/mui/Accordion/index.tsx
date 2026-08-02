import clsx from "clsx";
import { createContext, type JSX, useContext, useRef, useState } from "react";
import { type SxProps, useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import type { PaperProps } from "../Paper";
import Paper from "../Paper";

function ExpandMoreIcon() {
	return (
		<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden focusable="false">
			<path
				fill="currentColor"
				d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
			/>
		</svg>
	);
}

export type AccordionProps = {
	expended?: boolean;
	defaultExpended?: boolean;
	Summary?: JSX.Element;
	disabled?: boolean;
	sx?: SxProps;
} & PaperProps;

const ExpendedContext = createContext<
	[boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);
const StateContext = createContext<{ disabled?: boolean }>({
	disabled: false,
});

export default function Accordion({
	expended,
	defaultExpended,
	children,
	Summary,
	disabled,
	className,
	...props
}: AccordionProps) {
	const expendedControl = useState(Boolean(defaultExpended));

	const root = useClassNames({
		component_name: "Accordion_Root",
		className,
		state: [disabled && "disabled", expendedControl[0] && "expended"],
	});

	const collapse = useClassNames({
		component_name: "Accordion_Collapse",
		state: [expendedControl[0] && "expended", disabled && "disabled"],
	});

	const ref = useRef<HTMLDivElement>(null);

	if (typeof expended != "undefined" && expended != expendedControl[0])
		expendedControl[1](expended);

	return (
		<ExpendedContext value={expendedControl}>
			<StateContext value={{ disabled }}>
				<Paper elevation={5} {...props} className={root.combined}>
					{Summary && Summary}
					<div className={collapse.combined} ref={ref}>
						{children}
					</div>
				</Paper>
			</StateContext>
		</ExpendedContext>
	);
}

export type AccordionSummaryProps = {
	expendIcon?: JSX.Element;
	Element?: keyof JSX.IntrinsicElements;
} & MuiElementType<HTMLHeadingElement>;

export function AccordionSummary({
	children,
	expendIcon,
	className,
	Element = "h3",
	sx,
	...props
}: AccordionSummaryProps) {
	const style = useStyle(sx);
	const [expended, setExpended] = useContext(ExpendedContext);
	const { disabled } = useContext(StateContext);
	const root = useClassNames({
		component_name: "Accordion_Summary_Root",
		className,
	});

	const btn = useClassNames({
		component_name: "Accordion_Summary_Btn",
		state: [expended && "expended"],
	});

	const content = useClassNames({
		component_name: "Accordion_Summary_Content",
		state: [expended && "expended"],
	});
	const icon = useClassNames({
		component_name: "Accordion_Summary_Icon",
		state: [expended && "expended"],
	});

	return (
		<Element
			className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx}
			{...(props as any)}
		>
			<button
				className={btn.combined}
				type="button"
				tabIndex={0}
				aria-expanded={expended}
				onClick={() => setExpended((c) => !c)}
				disabled={disabled}
			>
				<span className={content.combined}>{children}</span>
				<span className={icon.combined}>
					{expendIcon || <ExpandMoreIcon />}
				</span>
			</button>
		</Element>
	);
}

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
