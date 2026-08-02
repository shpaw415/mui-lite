import clsx from "clsx";
import { type JSX, useEffect, useState } from "react";
import { useClassNames } from "../../common/theme";
import type { MuiElementType, SlotProps } from "../../common/utils";
import Box, { type BoxProps } from "../Box";
import type { PaperProps } from "../Paper";
import Paper from "../Paper";

type SnackCommon = {
	message?: string | JSX.Element;
	action?: JSX.Element | JSX.Element[];
};

export type SnackbarProps = SnackCommon & {
	position?:
		| "top-left"
		| "top-center"
		| "top-right"
		| "bottom-left"
		| "bottom-center"
		| "bottom-right";
	SlotProps?: SlotProps<{
		paper: PaperProps;
		message: BoxProps<HTMLDivElement>;
		action: BoxProps<HTMLDivElement>;
	}>;
	animation?: "fade" | "slide";
	animationSide?: "left" | "right" | "bottom" | "top";
	open?: boolean;
	autoHideDuration?: number;
	onClose?: () => void;
} & Omit<MuiElementType<HTMLDivElement>, "action">;

/**
 * Transient toast for success, errors, and short notifications.
 *
 * @example Saved toast
 * ```tsx
 * <Snackbar
 *   open={open}
 *   autoHideDuration={3000}
 *   onClose={onClose}
 *   message="Saved"
 * />
 * ```
 */
export default function Snackbar({
	className,
	message,
	action,
	position = "bottom-center",
	SlotProps,
	animation = "fade",
	animationSide,
	open = false,
	autoHideDuration,
	onClose,
	children,
	...props
}: SnackbarProps) {
	const root = useClassNames({
		component_name: "Snackbar_Root",
		className,
		state: [position, open && "open", animation, animationSide],
	});
	const [, setTimer] = useState<Timer>();
	useEffect(() => {
		if (open && autoHideDuration) {
			setTimer((c) => {
				clearTimeout(c);
				return setTimeout(() => {
					onClose?.();
				}, autoHideDuration);
			});
		} else if (!open) {
			setTimer((c) => {
				clearTimeout(c);
				return undefined;
			});
		}
		return () => {
			setTimer((c) => {
				clearTimeout(c);
				return undefined;
			});
		};
	}, [open, autoHideDuration, onClose]);

	return (
		<div role="presentation" className={root.combined} {...props}>
			{children ? (
				<Paper
					elevation={6}
					{...SlotProps?.paper}
					className={clsx(
						"MUI_Snackbar_Inner",
						"child",
						SlotProps?.paper?.className,
					)}
				>
					{children}
				</Paper>
			) : (
				<Paper
					elevation={6}
					{...SlotProps?.paper}
					className={clsx("MUI_Snackbar_Inner", SlotProps?.paper?.className)}
					role="alert"
				>
					<SnackbarContent
						message={message}
						action={action}
						SlotProps={SlotProps}
					/>
				</Paper>
			)}
		</div>
	);
}

export type SnackbarContentProps = SnackCommon & {
	className?: string;
	SlotProps?: SlotProps<{
		message: BoxProps<HTMLDivElement>;
		action: BoxProps<HTMLDivElement>;
	}>;
};

/**
 * Internal message + action row used by Snackbar.
 * Can also be composed inside a custom snackbar surface.
 */
export function SnackbarContent({
	message,
	action,
	className,
	SlotProps,
}: SnackbarContentProps) {
	return (
		<>
			{message != null && message !== "" && (
				<Box
					{...SlotProps?.message}
					className={clsx(
						"MUI_Snackbar_Content_Root",
						SlotProps?.message?.className,
						className,
					)}
				>
					{message}
				</Box>
			)}
			{action != null && (
				<Box
					{...SlotProps?.action}
					className={clsx(
						"MUI_Snackbar_Action_Root",
						SlotProps?.action?.className,
					)}
				>
					{action}
				</Box>
			)}
		</>
	);
}
