"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { useClassNames, useStyle, zIndex } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";
import Paper from "../Paper";
import { LinearProgress } from "../Progress";

export type MobileStepperProps = {
	steps: number;
	activeStep?: number;
	position?: "bottom" | "top" | "static";
	variant?: "dots" | "text" | "progress";
	backButton?: ReactNode;
	nextButton?: ReactNode;
	LinearProgressProps?: React.ComponentProps<typeof LinearProgress>;
} & MuiElementType<HTMLDivElement>;

/**
 * Compact step indicator for carousels and mobile wizards.
 *
 * @example Onboarding steps
 * ```tsx
 * <MobileStepper
 *   steps={4}
 *   activeStep={step}
 *   nextButton={<Button onClick={next}>Next</Button>}
 *   backButton={<Button onClick={back}>Back</Button>}
 * />
 * ```
 */
export default function MobileStepper({
	steps,
	activeStep = 0,
	position = "bottom",
	variant = "dots",
	backButton,
	nextButton,
	LinearProgressProps,
	className,
	sx,
	style,
	...props
}: MobileStepperProps) {
	const root = useClassNames({
		component_name: "MobileStepper",
		className,
		state: [`position-${position}`, `variant-${variant}`],
	});
	const sxStyle = useStyle(sx);

	const max = Math.max(0, steps - 1);
	const clamped = Math.min(Math.max(0, activeStep), max);
	const progressValue = steps <= 1 ? 100 : (clamped / max) * 100;

	return (
		<Paper
			{...(props as any)}
			square
			elevation={position === "static" ? 0 : 4}
			className={clsx(root.combined, sxStyle.classNameFromSx)}
			style={{
				zIndex:
					position === "static" ? undefined : zIndex.mobileStepper,
				...sxStyle.styleFromSx,
				...style,
			}}
		>
			{backButton}
			{variant === "text" && (
				<div className="MUI_MobileStepper_text">
					{clamped + 1} / {steps}
				</div>
			)}
			{variant === "dots" && (
				<div className="MUI_MobileStepper_dots">
					{Array.from({ length: steps }, (_, i) => (
						<span
							key={i}
							className={`MUI_MobileStepper_dot${i === clamped ? " MUI_MobileStepper_dot_active" : ""}`}
						/>
					))}
				</div>
			)}
			{variant === "progress" && (
				<LinearProgress
					{...LinearProgressProps}
					value={progressValue}
					variant="determinate"
					className={[
						"MUI_MobileStepper_progress",
						LinearProgressProps?.className ?? "",
					].join(" ")}
				/>
			)}
			{nextButton}
		</Paper>
	);
}
