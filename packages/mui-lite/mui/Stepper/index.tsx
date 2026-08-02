"use client";

import clsx from "clsx";
import {
	Children,
	createContext,
	cloneElement,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useContext,
} from "react";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

/* ─── context ─── */

type StepperContextValue = {
	activeStep: number;
	alternativeLabel: boolean;
	orientation: "horizontal" | "vertical";
	nonLinear: boolean;
	connector: ReactNode;
};

type StepContextValue = {
	index: number;
	last: boolean;
	active: boolean;
	completed: boolean;
	disabled: boolean;
	expanded?: boolean;
};

const StepperContext = createContext<StepperContextValue | null>(null);
const StepContext = createContext<StepContextValue | null>(null);

export function useStepperContext() {
	return useContext(StepperContext);
}
export function useStepContext() {
	return useContext(StepContext);
}

/* ─── StepConnector ─── */

export type StepConnectorProps = MuiElementType<HTMLDivElement>;

export function StepConnector({ className, sx, ...props }: StepConnectorProps) {
	const stepper = useStepperContext();
	const step = useStepContext();
	const root = useClassNames({
		component_name: "StepConnector",
		className,
		state: [
			stepper?.orientation,
			stepper?.alternativeLabel && "alternativeLabel",
			step?.active && "active",
			step?.completed && "completed",
			step?.disabled && "disabled",
		],
	});
	const style = useStyle(sx);
	return (
		<div className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx} {...props}>
			<span className="MUI_StepConnector_line" />
		</div>
	);
}

/* ─── StepIcon ─── */

export type StepIconProps = {
	icon?: ReactNode;
	active?: boolean;
	completed?: boolean;
	error?: boolean;
	className?: string;
};

export function StepIcon({
	icon,
	active,
	completed,
	error,
	className,
}: StepIconProps) {
	const step = useStepContext();
	const isActive = active ?? step?.active;
	const isCompleted = completed ?? step?.completed;
	const root = useClassNames({
		component_name: "StepIcon",
		className,
		state: [
			isActive && "active",
			isCompleted && "completed",
			error && "error",
		],
	});

	return (
		<span className={root.combined}>
			{isCompleted && !error ? (
				<svg className="MUI_StepIcon_svg" viewBox="0 0 24 24" aria-hidden>
					<path
						d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"
						fill="currentColor"
					/>
				</svg>
			) : error ? (
				<svg className="MUI_StepIcon_svg" viewBox="0 0 24 24" aria-hidden>
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
						fill="currentColor"
					/>
				</svg>
			) : (
				<span className="MUI_StepIcon_text">{icon ?? (step ? step.index + 1 : 1)}</span>
			)}
		</span>
	);
}

/* ─── StepLabel ─── */

export type StepLabelProps = {
	children?: ReactNode;
	optional?: ReactNode;
	error?: boolean;
	icon?: ReactNode;
	StepIconComponent?: React.ComponentType<StepIconProps>;
} & MuiElementType<HTMLSpanElement>;

export function StepLabel({
	children,
	optional,
	error,
	icon,
	StepIconComponent = StepIcon,
	className,
	sx,
	...props
}: StepLabelProps) {
	const stepper = useStepperContext();
	const step = useStepContext();
	const root = useClassNames({
		component_name: "StepLabel",
		className,
		state: [
			step?.active && "active",
			step?.completed && "completed",
			step?.disabled && "disabled",
			error && "error",
			stepper?.alternativeLabel && "alternativeLabel",
			stepper?.orientation,
		],
	});
	const style = useStyle(sx);

	return (
		<span className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx} {...props}>
			<span className="MUI_StepLabel_iconContainer">
				<StepIconComponent
					icon={icon}
					active={step?.active}
					completed={step?.completed}
					error={error}
				/>
			</span>
			<span className="MUI_StepLabel_labelContainer">
				<span className="MUI_StepLabel_label">{children}</span>
				{optional && (
					<span className="MUI_StepLabel_optional">{optional}</span>
				)}
			</span>
		</span>
	);
}

/* ─── StepContent ─── */

export type StepContentProps = {
	children?: ReactNode;
	TransitionComponent?: React.ComponentType<{
		in?: boolean;
		children?: ReactNode;
	}>;
} & MuiElementType<HTMLDivElement>;

export function StepContent({
	children,
	className,
	sx,
	...props
}: StepContentProps) {
	const step = useStepContext();
	const stepper = useStepperContext();
	if (stepper?.orientation !== "vertical") return null;

	const root = useClassNames({
		component_name: "StepContent",
		className,
		state: [step?.active && "active", step?.last && "last"],
	});
	const style = useStyle(sx);

	if (!step?.active && !step?.expanded) return null;

	return (
		<div className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx} {...props}>
			{children}
		</div>
	);
}

/* ─── StepButton ─── */

export type StepButtonProps = {
	children?: ReactNode;
	icon?: ReactNode;
	optional?: ReactNode;
	onClick?: React.MouseEventHandler;
} & MuiElementType<HTMLButtonElement>;

export function StepButton({
	children,
	icon,
	optional,
	className,
	sx,
	onClick,
	...props
}: StepButtonProps) {
	const root = useClassNames({
		component_name: "StepButton",
		className,
	});
	const style = useStyle(sx);
	return (
		<button
			type="button"
			className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx}
			onClick={onClick}
			{...props}
		>
			{isValidElement(children) ? (
				children
			) : (
				<StepLabel icon={icon} optional={optional}>
					{children}
				</StepLabel>
			)}
		</button>
	);
}

/* ─── Step ─── */

export type StepProps = {
	children?: ReactNode;
	active?: boolean;
	completed?: boolean;
	disabled?: boolean;
	expanded?: boolean;
	index?: number;
	last?: boolean;
} & MuiElementType<HTMLDivElement>;

export function Step({
	children,
	active: activeProp,
	completed: completedProp,
	disabled: disabledProp,
	expanded,
	index = 0,
	last = false,
	className,
	sx,
	...props
}: StepProps) {
	const stepper = useStepperContext();
	const active =
		activeProp ??
		(stepper ? index === stepper.activeStep : false);
	const completed =
		completedProp ??
		(stepper && !stepper.nonLinear
			? index < stepper.activeStep
			: false);
	const disabled =
		disabledProp ??
		(stepper && !stepper.nonLinear
			? index > stepper.activeStep
			: false);

	const ctx: StepContextValue = {
		index,
		last,
		active,
		completed: Boolean(completed),
		disabled: Boolean(disabled),
		expanded,
	};

	const root = useClassNames({
		component_name: "Step",
		className,
		state: [
			active && "active",
			completed && "completed",
			disabled && "disabled",
			stepper?.alternativeLabel && "alternativeLabel",
			stepper?.orientation,
		],
	});
	const style = useStyle(sx);

	return (
		<StepContext value={ctx}>
			<div className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx} {...props}>
				{index > 0 && stepper?.connector}
				{children}
			</div>
		</StepContext>
	);
}

/* ─── Stepper ─── */

export type StepperProps = {
	children?: ReactNode;
	activeStep?: number;
	alternativeLabel?: boolean;
	nonLinear?: boolean;
	orientation?: "horizontal" | "vertical";
	connector?: ReactNode;
} & MuiElementType<HTMLDivElement>;

export default function Stepper({
	children,
	activeStep = 0,
	alternativeLabel = false,
	nonLinear = false,
	orientation = "horizontal",
	connector = <StepConnector />,
	className,
	sx,
	...props
}: StepperProps) {
	const root = useClassNames({
		component_name: "Stepper",
		className,
		state: [
			orientation,
			alternativeLabel && "alternativeLabel",
			nonLinear && "nonLinear",
		],
	});
	const style = useStyle(sx);

	const ctx: StepperContextValue = {
		activeStep,
		alternativeLabel,
		orientation,
		nonLinear,
		connector,
	};

	const steps = Children.toArray(children).filter(Boolean);
	const content = steps.map((child, index) => {
		if (!isValidElement(child)) return child;
		return cloneElement(child as ReactElement<any>, {
			index,
			last: index + 1 === steps.length,
			key: (child as any).key ?? index,
		});
	});

	return (
		<StepperContext value={ctx}>
			<div
				className={clsx(root.combined, style.classNameFromSx)} style={style.styleFromSx}
				{...props}
			>
				{content}
			</div>
		</StepperContext>
	);
}
