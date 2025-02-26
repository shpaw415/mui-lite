import { RippleBase } from "@/common/ripple";
import { useClassNames, useStyle } from "@/common/theme";
import {
  PropsOverRideProvider,
  useValueOverRide,
  type MuiElementType,
} from "@/common/utils";
import { type SlotProps } from "../../common/utils";
import {
  createElement,
  useMemo,
  useRef,
  type ElementType,
  type JSX,
  type ReactNode,
} from "react";
import Box, { type BoxProps } from "../Box";
import type { MuiIconButtonProps } from "../IconButton";

export type ListProps = {
  disablePadding?: boolean;
  subheader?: ReactNode;
  component?: ElementType;
  dense?: boolean;
} & MuiElementType<HTMLUListElement>;

export function List({
  sx,
  subheader,
  children,
  disablePadding,
  component = "ul",
  dense,
  className,
  ...props
}: ListProps) {
  const style = useStyle(sx);
  const root = useClassNames({
    component_name: "List_Root",
    className,
    state: [dense && "dense", disablePadding && "disabled-padding"],
  });
  return createElement(component, {
    ...props,
    className: root.combined,
    style: style.styleFromSx,
    children: (
      <>
        {subheader && (
          <div className="MUI_ListItem_SubHeader_Root">{subheader}</div>
        )}
        {children}
      </>
    ),
  });
}

export type ListItemProps = {
  alignItems?: "center" | "flex-start";
  dense?: boolean;
  divider?: boolean;
  disableGutters?: boolean;
  disablePadding?: boolean;
  secondaryAction?: JSX.Element;
  component?: ElementType;
} & MuiElementType<HTMLLIElement>;

export function ListItem({
  sx,
  component = "li",
  secondaryAction,
  disableGutters,
  disablePadding,
  className,
  alignItems = "center",
  dense,
  children,
  ...props
}: ListItemProps) {
  const style = useStyle(sx);
  const root = useClassNames({
    component_name: "ListItem_Root",
    className,
    state: [
      disablePadding && "disabled-padding",
      dense && "dense",
      disableGutters && "disabled-gutters",
    ],
  });
  return createElement(component, {
    ...props,
    style: style.styleFromSx,
    className: root.combined,
    children: (
      <>
        {children}
        {secondaryAction && (
          <div className="MUI_ListItem_SecondaryAction">
            <PropsOverRideProvider<MuiIconButtonProps>
              props={{
                colorOverRide: style.theme.theme == "light" ? "black" : "white",
              }}
            >
              {secondaryAction}
            </PropsOverRideProvider>
          </div>
        )}
      </>
    ),
  });
}

export type ListItemButtonProps = {
  type?: HTMLButtonElement["type"];
  component?: ElementType;
} & Omit<MuiElementType<HTMLButtonElement>, "type">;

export function ListItemButton({
  className,
  sx,
  children,
  component = "button",
  selected,
  ...props
}: ListItemButtonProps) {
  const root = useClassNames({
    className,
    component_name: "ListItemButton_Root",
    state: [selected && "selected"],
  });
  const style = useStyle(sx);
  const ref = useRef<HTMLDivElement>(null);
  return createElement(component, {
    type: "button",
    role: "button",
    tabIndex: 0,
    style: style.styleFromSx,
    className: root.combined,
    ...props,
    children: (
      <>
        {children}
        <div
          className="absolute top-0 left-0 w-full h-full overflow-hidden"
          ref={ref}
        >
          <RippleBase ref={ref} preventClickElement />
        </div>
      </>
    ),
  });
}

export type ListItemIconProps = {} & MuiElementType<HTMLDivElement>;

export function ListItemIcon({ className, sx, ...props }: ListItemIconProps) {
  const classes = useMemo(
    () => `MUI_ListItemIcon_Root ${className ?? ""}`,
    [className]
  );
  const style = useStyle(sx);
  const opacityVar = useValueOverRide({
    variable: "--theme-opacity",
    valueOverRide: style.theme.theme == "light" ? "0.54" : "1",
  });
  return (
    <div
      {...props}
      className={classes}
      style={{ ...style.styleFromSx, ...opacityVar }}
    />
  );
}

export type ListItemTextProps<T extends keyof JSX.IntrinsicElements> = {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  inset?: boolean;
  SlotProps?: SlotProps<{
    primary: BoxProps;
    secondary: BoxProps;
  }>;
} & MuiElementType<HTMLDivElement>;

export function ListItemText({
  className,
  sx,
  primary,
  secondary,
  children,
  inset,
  SlotProps,
  ...props
}: ListItemTextProps<"span">) {
  const root = useClassNames({
    component_name: "ListItemText_Root",
    className,
    state: [inset && "inset"],
  });

  const primaryClasses = useClassNames({
    component_name: "ListItemText_Primary",
    className: SlotProps?.primary?.className,
  });

  const style = useStyle(sx);
  return (
    <div {...props} style={style.styleFromSx} className={root.combined}>
      <Box
        Element="span"
        {...SlotProps?.primary}
        className={primaryClasses.combined}
      >
        {primary}
      </Box>
      {secondary && (
        <Box
          Element="p"
          className={`MUI_ListItemText_Secondary ${
            SlotProps?.secondary?.className ?? ""
          }`}
        >
          {secondary}
        </Box>
      )}
      {children}
    </div>
  );
}

export type ListItemAvatarProps = MuiElementType<HTMLDivElement>;

export function ListItemAvatar({
  sx,
  className,
  ...props
}: ListItemAvatarProps) {
  const style = useStyle(sx);

  return (
    <div
      style={style.styleFromSx}
      className={[className || "", "MUI_ListItem_Avatar_Root"].join(" ")}
      {...props}
    />
  );
}

export type CollapseProps = {
  open?: boolean;
  timeout?: number;
  orientation?: "vertical" | "horizontal";
} & MuiElementType<HTMLDivElement>;

export function Collapse({
  sx,
  className,
  orientation = "vertical",
  open,
  children,
  timeout,
  ...props
}: CollapseProps) {
  const root = useClassNames({
    component_name: "Collapse_Root",
    className,
    state: [orientation, open && "open"],
  });

  const wrapper = useClassNames({
    component_name: "Collapse_wrapper",
  });

  const wrapperInner = useClassNames({
    component_name: "Collapse_wrapper_inner",
  });
  const style = useStyle(sx);

  const timeoutOverRide = useValueOverRide({
    variable: "--collapse-timeout",
    valueOverRide: timeout && `${timeout}ms`,
  });

  return (
    <div
      className={root.combined}
      style={{ ...style.styleFromSx, ...timeoutOverRide }}
      {...props}
    >
      <div className={wrapper.combined}>
        <div className={wrapperInner.combined}>{children}</div>
      </div>
    </div>
  );
}

export type ListItemSubHeader = MuiElementType<HTMLLIElement>;

export function ListSubheader({ sx, className, ...props }: ListItemSubHeader) {
  const root = useClassNames({
    component_name: "List_Subheader_Root",
    className,
  });
  const style = useStyle(sx);

  return <li className={root.combined} style={style.styleFromSx} {...props} />;
}
