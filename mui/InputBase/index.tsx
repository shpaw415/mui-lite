"use client";
import type { InputHTMLAttributes, ReactElement, RefObject } from "react";
import { useClassNames, type SxProps } from "../../common/theme";

type InputBaseProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "style"
> & {
  variant?: "outlined" | "filled" | "standard";
  startIcon?: any;
  endIcon?: any;
  label?: string;
  color?: "error" | "success" | "secondary";
  helpText?: string;
  multiline?:
    | boolean
    | {
        minRows?: number;
        maxRows?: number;
      };
  children?: ReactElement<HTMLSelectElement>;
  resetValue?: boolean;
  sx?: SxProps;
  ref?: RefObject<HTMLInputElement | null>;
};

export default function InputBase({
  id,
  multiline,
  variant,
  ...props
}: InputBaseProps) {
  const classes_input = useClassNames({
    component_name: "TextField_Input",
    variant: variant,
    state: [],
  });

  const classes_textArea = useClassNames({
    component_name: "TextField_TextArea",
    variant: variant,
    state: [],
  });

  return multiline ? (
    <textarea
      id={id}
      className={classes_textArea.combined}
      placeholder=" "
      {...(props as any)}
    />
  ) : (
    <input
      id={id}
      className={classes_input.combined}
      placeholder=" "
      {...props}
    />
  );
}
