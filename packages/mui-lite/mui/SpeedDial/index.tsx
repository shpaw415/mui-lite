import clsx from "clsx";
import { cloneElement, type JSX, type ReactNode, useCallback } from "react";

function AddIcon() {
	return (
		<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden>
			<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
		</svg>
	);
}
import { useClassNames } from "../../common/theme";
import { type SlotProps, useClickAwayListener } from "../../common/utils";
import Box, { type BoxProps } from "../Box";
import FAB, { type FABProps } from "../FloatingActionButton";
import IconButton, { type MuiIconButtonProps } from "../IconButton";
import ToolTip, { type ToolTipProps } from "../ToolTip";

export type SpeedDialProps = {
	direction?: "up" | "down" | "left" | "right";
	icon?: ReactNode;
	openIcon?: ReactNode;
	closeIcon?: ReactNode;
	open?: boolean;
	onOpen?: () => void;
	onClose?: () => void;
	SlotProps?: SlotProps<{
		fab: FABProps;
		action?: BoxProps<HTMLDivElement>;
	}>;
	hidden?: boolean;
	trigger?: ("click" | "hover")[];
} & BoxProps<HTMLDivElement>;

export default function SpeedDial({
	children,
	SlotProps,
	className,
	trigger,
	open,
	onOpen,
	onClose,
	openIcon,
	closeIcon,
	...props
}: SpeedDialProps) {
	const root = useClassNames({
		component_name: "SpeedDial_root",
		className,
		state: [open && "open"],
	});

	const action_root = useClassNames({
		component_name: "SpeedDial_action",
		className: SlotProps?.action?.className,
	});

	if (!Array.isArray(children)) children = [children];

	const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
		(e) => {
			e.stopPropagation();
			open ? onClose?.() : onOpen?.();
		},
		[open],
	);

	const ref = useClickAwayListener<HTMLButtonElement>(
		(e) => {
			if (open && trigger?.includes("click")) onClose?.();
		},
		{
			deps: [open],
			ref: SlotProps?.fab?.ref,
		},
	);

	return (
		<Box
			role="presentation"
			{...props}
			className={root.combined}
			onMouseLeave={trigger?.includes("hover") ? onClose : undefined}
		>
			<FAB
				ref={ref}
				{...SlotProps?.fab}
				onClick={trigger?.includes("click") ? handleClick : undefined}
				onMouseEnter={trigger?.includes("hover") ? handleClick : undefined}
			>
				{openIcon && open && openIcon}
				{closeIcon && !open && closeIcon}
				{!openIcon && !closeIcon && <AddIcon className="MUI_default_icon" />}
			</FAB>
			<Box role="menu" {...SlotProps?.action} className={action_root.combined}>
				{(children as Array<JSX.Element>).map((child, i) =>
					cloneElement<SpeedDialActionProps>(child, {
						key: i,
						SlotProps: {
							root: {
								sx: {
									transitionDelay: `${i * 30}ms`,
								},
							},
						},
					}),
				)}
			</Box>
		</Box>
	);
}

export type SpeedDialActionProps = {
	tooltipTitle?: string;
	icon?: ReactNode;
	SlotProps?: SlotProps<{
		icon: MuiIconButtonProps;
		tooltip?: BoxProps<HTMLParagraphElement>;
		"native-tooltip": Partial<ToolTipProps>;
		root?: BoxProps<HTMLSpanElement>;
	}>;
	tooltipOpen?: boolean;
} & Omit<MuiIconButtonProps, "children">;

export function SpeedDialAction({
	tooltipTitle,
	tooltipOpen,
	icon,
	SlotProps,
	className,
	...props
}: SpeedDialActionProps) {
	const root = useClassNames({
		component_name: "SpeedDial_action_button_root",
		className: SlotProps?.root?.className,
	});

	const tooltip_root = useClassNames({
		component_name: "SpeedDial_action_button_tooltip",
		className: SlotProps?.tooltip?.className,
		state: [tooltipOpen && "open"],
	});

	const button = useClassNames({
		component_name: "SpeedDial_action_button",
		className,
	});

	return (
		<Box Element="span" {...SlotProps?.root} className={root.combined}>
			<Box
				Element="span"
				{...SlotProps?.tooltip}
				className={tooltip_root.combined}
			>
				{tooltipTitle}
			</Box>
			<ToolTip
				disabled={tooltipOpen}
				title={tooltipTitle || ""}
				triggers={["hover"]}
				placement="left"
				{...SlotProps?.["native-tooltip"]}
			>
				<IconButton
					tabIndex={-1}
					type="button"
					role="menuitem"
					{...props}
					className={button.combined}
				>
					{icon}
				</IconButton>
			</ToolTip>
		</Box>
	);
}
