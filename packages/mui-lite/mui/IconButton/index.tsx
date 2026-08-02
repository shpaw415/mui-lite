import clsx from "clsx";
import { RippleBase } from "../../common/ripple";
import { useClassNames, useStyle } from "../../common/theme";
import {
	type MuiElementColors,
	type MuiElementType,
	useColorOverRide,
	useMuiRef,
	usePropsOverRide,
} from "../../common/utils";

export type MuiIconButtonProps = {
	children: any;
	size?: "small" | "medium" | "large";
	color?: MuiElementColors;
	colorOverRide?: React.CSSProperties["color"];
	type?: HTMLButtonElement["type"];
	onRippleClick?: () => void;
} & Omit<MuiElementType<HTMLButtonElement>, "type" | "size">;

/**
 * Icon-only action for toolbars, lists, and compact UIs.
 *
 * @example Close
 * ```tsx
 * <IconButton aria-label="close" onClick={onClose}>
 *   <CloseIcon />
 * </IconButton>
 * ```
 */
function IconButton({
	children,
	color = "primary",
	size = "medium",
	className,
	colorOverRide,
	sx,
	onRippleClick,
	...props
}: MuiIconButtonProps) {
	const propsOverRide = usePropsOverRide<MuiIconButtonProps>(arguments);
	const resolvedSize = propsOverRide.size ?? size;

	const root = useClassNames({
		component_name: "IconButton_Root",
		className: className,
		overRide: propsOverRide?.className,
		state: [resolvedSize, color],
	});

	const ref = useMuiRef(props.ref);
	const style = useStyle([propsOverRide.sx, sx]);
	const overRideColorHex = useColorOverRide({
		colorOverRide: colorOverRide || propsOverRide.colorOverRide,
	});

	return (
		<Btn
			{...propsOverRide}
			{...props}
			className={clsx(root.combined, style.classNameFromSx)}
			ref={ref}
			style={{
				...style.styleFromSx,
				...overRideColorHex,
			}}
		>
			{children}
			{!props.disabled && (
				<RippleBase
					ref={ref}
					color={color}
					colorOverRide={colorOverRide}
					preventClickElement
					disabled={Boolean(props.disabled)}
					onRippleClick={onRippleClick}
				/>
			)}
		</Btn>
	);
}

function Btn({ colorOverRide, sx, size, color, ...props }: MuiIconButtonProps) {
	return <button {...props} />;
}

export default IconButton;
