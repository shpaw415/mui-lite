import { useClassNames } from "@/common/theme";
import Box, { type BoxProps } from "../Box";
import { useClickAwayListener, type SlotProps } from "../../common/utils";

import AddIcon from "@svg/filled/add.svg";
import FAB, { type FABProps } from "../FloatingActionButton";
import { cloneElement, useCallback, type JSX, type ReactNode } from "react";
import IconButton, { type MuiIconButtonProps } from "../IconButton";
import ToolTip, { type ToolTipProps } from "../ToolTip";
import clsx from "clsx";

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
    action?: BoxProps;
  }>;
  hidden?: boolean;
  trigger?: ("click" | "hover")[];
} & BoxProps;

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
    [open]
  );

  const ref = useClickAwayListener<HTMLButtonElement>(
    (e) => {
      if (open && trigger?.includes("click")) onClose?.();
    },
    {
      deps: [open],
      ref: SlotProps?.fab?.ref,
    }
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
          })
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
    tooltip?: BoxProps;
    "native-tooltip": Partial<ToolTipProps>;
    root?: BoxProps;
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
