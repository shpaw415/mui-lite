import clsx from "clsx";
import { type CSSProperties, type JSX, useMemo } from "react";
import { useClassNames, useStyle, useTheme } from "../../common/theme";
import {
	PropsOverRideProvider,
	type SlotProps,
	useColorOverRide,
} from "../../common/utils";
import Box, { type BoxProps } from "../Box";
import type { ButtonProps } from "../Button";
import IconButton from "../IconButton";
import Paper, { type PaperProps } from "../Paper";

function SvgIcon({
	d,
	...props
}: { d: string } & React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			focusable="false"
			aria-hidden="true"
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			{...props}
		>
			<path fill="currentColor" d={d} />
		</svg>
	);
}

const ErrorIcon = () => (
	<SvgIcon d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
);
const WarningIcon = () => (
	<SvgIcon d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
);
const InfoIcon = () => (
	<SvgIcon d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-1 15h2v-6h-2v6z" />
);
const SuccessIcon = () => (
	<SvgIcon d="M20 12a8 8 0 1 1-8-8c.76 0 1.5.11 2.2.31l1.57-1.57C14.61 2.26 13.34 2 12 2a10 10 0 1 0 10 10M7.91 10.08 6.5 11.5 11 16 21 6l-1.41-1.42L11 13.17l-3.09-3.09z" />
);
const CloseIcon = () => (
	<SvgIcon d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
);

export type AlertProps = {
	variant?: "default" | "filled" | "outlined";
	severity: "error" | "info" | "warning" | "success";
	icon?: JSX.Element | false;
	action?: JSX.Element;
	title?: string;
	textColor?: CSSProperties["color"];
	onClose?: React.MouseEventHandler<HTMLButtonElement>;
	SlotProps?: SlotProps<{
		icon?: BoxProps<HTMLDivElement>;
	}>;
} & Omit<PaperProps, "variant" | "action">;

/**
 * Persistent inline feedback for success, warning, error, or info.
 *
 * @example Form validation error
 * ```tsx
 * <Alert severity="error">Please fix the highlighted fields.</Alert>
 * ```
 */
export default function Alert({
	sx,
	variant = "default",
	severity,
	icon,
	action,
	title,
	children,
	textColor,
	onClose,
	SlotProps,
	...props
}: AlertProps) {
	const Icon = useMemo(() => {
		if (icon != undefined) return icon;
		switch (severity) {
			case "error":
				return <ErrorIcon />;
			case "info":
				return <InfoIcon />;
			case "success":
				return <SuccessIcon />;
			case "warning":
				return <WarningIcon />;
			default:
				return undefined;
		}
	}, [icon, severity]);

	const theme = useTheme();

	const currentThemeColor = useMemo(() => {
		switch (severity) {
			case "error":
				return theme["text-error"][theme.theme];
			case "info":
				return theme["text-info"][theme.theme];
			case "success":
				return theme["text-success"][theme.theme];
			case "warning":
				return theme["text-warning"][theme.theme];
		}
	}, [severity, theme.theme]);

	const colorOverride = useColorOverRide(
		{
			colorOverRide: currentThemeColor,
			offset(rgb, utils) {
				if (theme.theme == "light") return utils.Darker(rgb, 100);
				return utils.Lighter(rgb, 140);
			},
		},
		[currentThemeColor],
	);

	const root = useClassNames({
		component_name: "Alert_Root",
		state: [variant, severity],
	});
	const style = useStyle(sx);

	// Don't let consumer style/className clobber layout after our merges
	const {
		className: propsClassName,
		style: propsStyle,
		...paperProps
	} = props as PaperProps & {
		className?: string;
		style?: CSSProperties;
	};

	return (
		<Paper
			role="alert"
			elevation={0}
			{...paperProps}
			style={{
				...style.styleFromSx,
				...colorOverride,
				...propsStyle,
			}}
			className={clsx(root.combined, style.classNameFromSx, propsClassName)}
		>
			{Icon && (
				<Box
					{...SlotProps?.icon}
					className={["MUI_Alert_icon", SlotProps?.icon?.className].join(" ")}
				>
					{Icon}
				</Box>
			)}
			{/* Message column: title + body share padding so text aligns with the icon */}
			<div className="MUI_Alert_message">
				{title && <div className="MUI_Alert_Title">{title}</div>}
				{children != null && children !== false && (
					<div className="MUI_Alert_description">{children}</div>
				)}
			</div>
			<PropsOverRideProvider<ButtonProps>
				props={{ variant: "text", color: severity as any }}
			>
				{action && <div className="MUI_Alert_Action">{action}</div>}
				{!action && onClose && (
					<div className="MUI_Alert_Action">
						<IconButton onClick={onClose} size="small">
							<CloseIcon />
						</IconButton>
					</div>
				)}
			</PropsOverRideProvider>
		</Paper>
	);
}
