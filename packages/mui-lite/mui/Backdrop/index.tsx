import clsx from "clsx";
import { useClassNames, useStyle } from "../../common/theme";
import type { MuiElementType } from "../../common/utils";

export type BackdropProps = {
	open?: boolean;
	/** 0–1 dim amount over the page (default 0.5) */
	invisible?: boolean;
} & MuiElementType<HTMLDivElement>;

export default function Backdrop({
	sx,
	open,
	className,
	invisible = false,
	style,
	...props
}: BackdropProps) {
	const sxStyle = useStyle(sx);

	const root = useClassNames({
		component_name: "Backdrop_Root",
		state: [open && "opened", invisible && "invisible"],
		className,
	});

	return (
		<div
			aria-hidden={!open}
			style={{
				...sxStyle.styleFromSx,
				...style,
			}}
			className={clsx(root.combined, sxStyle.classNameFromSx)}
			{...props}
		/>
	);
}
