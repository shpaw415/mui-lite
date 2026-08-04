import clsx from "clsx";
import { RippleBase } from "../../common/ripple";
import {
	type SxProps,
	useClassNames,
	useStyle,
} from "../../common/theme";
import {
	type MuiElementColors,
	type MuiElementType,
	useColorOverRide,
	useMuiRef,
} from "../../common/utils";

export type FABProps = {
	color?: MuiElementColors;
	children?: any;
	type?: HTMLButtonElement["type"];
	variant?: "extended";
	size?: "small" | "medium" | "large";
	bgColorOverRide?: React.CSSProperties["color"];
	colorOverRide?: React.CSSProperties["color"];
} & Omit<MuiElementType<HTMLButtonElement>, "type" | "size">;

/**
 * Primary floating action for create / compose on a screen.
 *
 * @example Compose
 * ```tsx
 * <FAB color="primary" aria-label="add" onClick={compose}>
 *   <AddIcon />
 * </FAB>
 * ```
 */
export default function FAB({
	className,
	color,
	children,
	sx,
	variant,
	size,
	bgColorOverRide,
	colorOverRide,
	...props
}: FABProps) {
	const btn = useClassNames({
		component_name: "FAB_Root",
		className,
		state: [color, variant, size],
	});
	const ref = useMuiRef(props.ref);
	const style = useStyle(sx);
	const bgOverride = useColorOverRide({
		colorOverRide: bgColorOverRide,
		variable: "--bg-color-override",
	});
	const colorOverride = useColorOverRide({
		colorOverRide,
		variable: "--color-override-fill",
	});
	return (
		<button
			className={clsx(btn.combined, style.classNameFromSx)}
			style={{
				...bgOverride,
				...colorOverride,
				...style.styleFromSx,
			}}
			{...props}
			ref={ref}
		>
			{children}
			{!props.disabled && (
				<RippleBase
					ref={ref}
					// FAB labels use contrast color on a filled surface — inherit host.
					// When a palette color is set without a fill override, force palette ink.
					color={bgColorOverRide ? undefined : color}
					colorOverRide={colorOverRide}
					preventClickElement
					disabled={Boolean(props.disabled)}
				/>
			)}
		</button>
	);
}
