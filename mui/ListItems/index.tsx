"use client";
import Box from "../Box";
import { createContext, use, type JSX, type RefObject } from "react";
import { useClassNames, useStyle, type SxProps } from "../../common/theme";
import RippleEffect from "@/common/ripple";
import Typography from "../Typography";

export type ListItemProps = {
  children: JSX.Element[] | JSX.Element;
  Header?: any;
  disablePadding?: boolean;
  sx?: SxProps;
  ref?: RefObject<HTMLDivElement>;
  direction?: "row" | "col";
  preventHoverEffect?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const HoverContext = createContext(false);

function ListItems({
  children,
  Header,
  disablePadding,
  sx,
  direction = "col",
  preventHoverEffect,
  ...props
}: ListItemProps) {
  const style = useStyle(sx);

  const ul = useClassNames({
    state: [disablePadding && "noPadding"],
    component_name: "ListItem_ul",
  });

  const header = useClassNames({
    component_name: "ListItem_subHeader",
  });

  const nav = useClassNames({
    component_name: "ListItem_nav",
    state: [direction, preventHoverEffect && "noHover"],
  });

  let groupedChildren: Array<JSX.Element[] | JSX.Element> = [];
  let currentGroup: JSX.Element[] = [];

  if (Header) {
    groupedChildren.push(
      <Box className={header.combined} key="Mui-List-Header">
        {Header}
      </Box>
    );
  }

  if (!Array.isArray(children)) children = [children];

  for (const el of children) {
    if (el.type.name != "Divier") {
      currentGroup.push(el);
      continue;
    }
    groupedChildren.push(currentGroup);
    groupedChildren.push(el);
    currentGroup = [];
  }
  groupedChildren.push(currentGroup);

  return (
    <div style={style.styleFromSx} {...props}>
      {groupedChildren.flatMap((elArrayORSeparator, index) => {
        if (Array.isArray(elArrayORSeparator))
          return (
            <nav key={index} className={nav.combined}>
              {(groupedChildren[index] as Array<JSX.Element>).flatMap(
                (elArray, index) => {
                  return (
                    <ul key={index} className={ul.combined}>
                      <HoverContext value={Boolean(preventHoverEffect)}>
                        {elArray}
                      </HoverContext>
                    </ul>
                  );
                }
              )}
            </nav>
          );

        return elArrayORSeparator;
      })}
    </div>
  );
}

export type ListItemsElement = {
  startElement?: JSX.Element;
  endElement?: JSX.Element;
  children?: string | JSX.Element;
  helperText?: string | JSX.Element;
  selected?: boolean;
  inset?: boolean;
  sx?: SxProps;
  ref?: RefObject<HTMLDivElement>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "style">;

function ListItemElement({
  children,
  startElement,
  endElement,
  helperText,
  selected,
  inset,
  sx,
  className,
  ...props
}: ListItemsElement) {
  const _style = useStyle(sx);

  const li = useClassNames({
    component_name: "ListItem_li",
  });
  const wrapper = useClassNames({
    component_name: "ListItem_li_Wrapper",
    state: [selected && "selected"],
    className,
  });
  const contentWrapper = useClassNames({
    component_name: "ListItem_li_Content_Wrapper",
  });
  const IconRoot = useClassNames({
    component_name: "ListItem_li_StartIcon_Root",
  });
  const endIconRoot = useClassNames({
    component_name: "ListItem_EndElement_Root",
  });
  const helper = useClassNames({
    component_name: "ListItem_li_HelperText",
  });

  return (
    <li className={li.combined} style={_style.styleFromSx}>
      <RippleEffect
        className="flex flex-1"
        disabled={use(HoverContext)}
        offset={{
          top: 100,
          left: 100,
        }}
      >
        <Box className={wrapper.combined} tabIndex={0} role="button" {...props}>
          {startElement && (
            <div className={IconRoot.combined}>{startElement}</div>
          )}
          {inset && <div className={IconRoot.combined} />}
          {typeof children == "string" ? (
            <div className={contentWrapper.combined}>
              <Typography>{children}</Typography>
              {helperText && <p className={helper.combined}>{helperText}</p>}
            </div>
          ) : (
            children
          )}

          {endElement && (
            <div className={endIconRoot.combined}>{endElement}</div>
          )}
        </Box>
      </RippleEffect>
    </li>
  );
}
export default ListItems;
export { ListItemElement };
