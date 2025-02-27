import type { MuiElementType } from "../../common/utils";
import type { PaperProps } from "../Paper";
import Paper from "../Paper";
import { useClassNames, useStyle, type SxProps } from "../../common/theme";
import { createContext, useContext, useRef, useState, type JSX } from "react";

import ExpendIcon from "@material-design-icons/svg/filled/expand_more.svg";

export type AccordionProps = {
  expended?: boolean;
  defaultExpended?: boolean;
  Summary?: JSX.Element;
  disabled?: boolean;
  sx?: SxProps;
} & PaperProps;

const ExpendedContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);
const StateContext = createContext<{ disabled?: boolean }>({
  disabled: false,
});

export default function Accordion({
  expended,
  defaultExpended,
  children,
  Summary,
  disabled,
  className,
  ...props
}: AccordionProps) {
  const expendedControl = useState(Boolean(defaultExpended));

  const root = useClassNames({
    component_name: "Accordion_Root",
    className,
    state: [disabled && "disabled", expendedControl[0] && "expended"],
  });

  const collapse = useClassNames({
    component_name: "Accordion_Collapse",
    state: [expendedControl[0] && "expended", disabled && "disabled"],
  });

  const ref = useRef<HTMLDivElement>(null);

  if (typeof expended != "undefined" && expended != expendedControl[0])
    expendedControl[1](expended);

  return (
    <ExpendedContext value={expendedControl}>
      <StateContext value={{ disabled }}>
        <Paper elevation={5} {...props} className={root.combined}>
          {Summary && Summary}
          <div className={collapse.combined} ref={ref}>
            {children}
          </div>
        </Paper>
      </StateContext>
    </ExpendedContext>
  );
}

export type AccordionSummaryProps = {
  expendIcon?: JSX.Element;
  Element?: keyof JSX.IntrinsicElements;
} & MuiElementType<HTMLHeadingElement>;

export function AccordionSummary({
  children,
  expendIcon,
  className,
  Element = "h3",
  sx,
  ...props
}: AccordionSummaryProps) {
  const style = useStyle(sx);
  const [expended, setExpended] = useContext(ExpendedContext);
  const { disabled } = useContext(StateContext);
  const root = useClassNames({
    component_name: "Accordion_Summary_Root",
    className,
  });

  const btn = useClassNames({
    component_name: "Accordion_Summary_Btn",
    state: [expended && "expended"],
  });

  const content = useClassNames({
    component_name: "Accordion_Summary_Content",
    state: [expended && "expended"],
  });
  const icon = useClassNames({
    component_name: "Accordion_Summary_Icon",
    state: [expended && "expended"],
  });

  return (
    <Element
      className={root.combined}
      style={style.styleFromSx}
      {...(props as any)}
    >
      <button
        className={btn.combined}
        type="button"
        tabIndex={0}
        aria-expanded={expended}
        onClick={() => setExpended((c) => !c)}
        disabled={disabled}
      >
        <span className={content.combined}>{children}</span>
        <span className={icon.combined}>{expendIcon || <ExpendIcon />}</span>
      </button>
    </Element>
  );
}

export type AccordionDetailsProps = MuiElementType<HTMLDivElement>;

export function AccordionDetails({
  className,
  sx,
  ...props
}: AccordionDetailsProps) {
  const style = useStyle(sx);
  return (
    <div
      className={`MUI_Accordion_Details_Root ${className || ""}`}
      style={style.styleFromSx}
      {...props}
    />
  );
}

export type AccordionActionProps = MuiElementType<HTMLDivElement>;

export function AccordionActions({
  className,
  sx,
  ...props
}: AccordionActionProps) {
  const style = useStyle(sx);
  return (
    <div
      className={`MUI_Accordion_Actions_Root ${className || ""}`}
      style={style.styleFromSx}
      {...props}
    />
  );
}
