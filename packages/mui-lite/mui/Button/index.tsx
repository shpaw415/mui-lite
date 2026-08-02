"use client";
import clsx from "clsx";
import { RippleBase } from "../../common/ripple";
import { useClassNames, useStyle } from "../../common/theme";
import {
	type MuiElementColors,
	type MuiElementType,
	PropsOverRideProvider,
	useMuiRef,
	usePropsOverRide,
} from "../../common/utils";

export type ButtonProps = {
	children: any;
	onClick?: (event: React.MouseEvent) => void;
	variant?: "contained" | "outlined" | "text";
	color?: MuiElementColors;
	size?: "small" | "medium" | "large";
	fullWidth?: boolean;
	disableRipple?: boolean;
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
	href?: string;
} & Omit<MuiElementType<HTMLButtonElement>, "size"> &
	React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>;

function Button({
	children,
	sx,
	variant,
	color,
	className,
	size,
	fullWidth,
	disableRipple,
	startIcon,
	endIcon,
	href,
	...props
}: ButtonProps) {
	const override = usePropsOverRide<ButtonProps>(arguments);
	const style = useStyle([sx, !color && override.sx]);
	const resolvedVariant = variant || override.variant || "contained";
	const classes = useClassNames({
		component_name: "Button",
		variant: resolvedVariant,
		state: [
			color || override.color,
			size || override?.size,
			fullWidth && "fullWidth",
		],
		className: className,
		overRide: override,
	});
	const ref = useMuiRef<HTMLButtonElement>(props.ref);
	const content = (
		<>
			{startIcon && <span className="MUI_Button_startIcon">{startIcon}</span>}
			{children}
			{endIcon && <span className="MUI_Button_endIcon">{endIcon}</span>}
			{!disableRipple && <RippleBase ref={ref} preventClickElement />}
		</>
	);
	const shared = {
		className: clsx(classes.combined, style.classNameFromSx), style: style.styleFromSx,
		...props,
		ref,
	};
	if (href) {
		return (
			<a href={href} {...(shared as any)}>
				{content}
			</a>
		);
	}
	return <button {...shared}>{content}</button>;
}

export type MuiButtonGroupProps = Omit<
	MuiElementType<HTMLDivElement>,
	"size"
> & {
	variant?: ButtonProps["variant"];
	size?: ButtonProps["size"];
};

export function ButtonGroup({ className, ...props }: MuiButtonGroupProps) {
	return (
		<PropsOverRideProvider<ButtonProps>
			props={{ variant: props.variant, size: props.size }}
		>
			<div
				role="group"
				className={[className, "MUI_ButtonGroup_Root"].join(" ")}
				{...props}
			/>
		</PropsOverRideProvider>
	);
}

export default Button;
