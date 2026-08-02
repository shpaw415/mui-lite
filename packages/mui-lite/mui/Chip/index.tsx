import clsx from "clsx";
import type { JSX, RefObject } from "react";

function CancelIcon() {
	return (
		<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden focusable="false">
			<path
				fill="currentColor"
				d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
			/>
		</svg>
	);
}
import { RippleBase } from "../../common/ripple";
import { useClassNames, useStyle, useTheme } from "../../common/theme";
import {
	type MuiElementColors,
	type MuiElementType,
	useMuiRef,
	useValueOverRide,
} from "../../common/utils";

export type ChipProps = {
	variant?: "filled" | "outlined";
	onDelete?: (el: RefObject<HTMLDivElement>) => void;
	deleteIcon?: JSX.Element;
	avatar?: JSX.Element;
	color?: MuiElementColors;
	icon?: JSX.Element;
	size?: "small";
} & Omit<MuiElementType<HTMLDivElement>, "size">;

export default function Chip({
	variant = "filled",
	children,
	sx,
	onDelete,
	deleteIcon,
	avatar,
	className,
	color,
	icon,
	size,
	...props
}: ChipProps) {
	const root = useClassNames({
		component_name: "Chip_Root",
		state: [
			variant,
			props.onClick && "clickable",
			onDelete && "deletable",
			"avatar-chip",
			color,
			size,
		],
		className,
	});

	const theme = useTheme();

	const borderOutlinedVar = useValueOverRide({
		variable: "--chip-color",
		valueOverRide: theme.theme == "light" ? "189, 189, 189" : "97, 97, 97",
	});
	const avatarColorVar = useValueOverRide({
		variable: "--avatar-color",
		valueOverRide: theme.theme == "light" ? "97, 97, 97" : "224, 224, 224",
	});

	const style = useStyle(sx);
	const ref = useMuiRef(props.ref);

	return (
		<div
			className={clsx(root.combined, style.classNameFromSx)}
			style={{
				...(borderOutlinedVar as React.CSSProperties),
				...(avatarColorVar as React.CSSProperties),
				...style.styleFromSx,
			}}
			{...props}
			ref={ref}
		>
			{avatar && avatar}
			{icon && !avatar && icon}
			<span className="MUI_Chip_Content">
				{children}
				<RippleBase
					preventClickElement
					disabled={!props.onClick || Boolean(onDelete)}
					ref={ref}
					colorOverRide={theme["text-main"][theme.theme]}
				/>
			</span>
			{onDelete && (
				<span
					className="MUI_Chip_Delete_Icon_Wrapper"
					onClick={(e) => {
						e.stopPropagation();
						onDelete(ref as RefObject<HTMLDivElement>);
					}}
				>
					{deleteIcon ? deleteIcon : <CancelIcon />}
				</span>
			)}
		</div>
	);
}
