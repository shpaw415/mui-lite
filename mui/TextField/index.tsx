"use client";
import { useId, type RefObject } from "react";
import { useClassNames, useStyle } from "../../common/theme";
import { type MuiElementType } from "../../common/utils";
import InputBase from "../InputBase";

export type TextFieldProps = {
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
  children?: any;
  resetValue?: boolean;
  ref?: RefObject<HTMLInputElement | null>;
} & Omit<MuiElementType<HTMLInputElement>, "size">;

function TextField({
  color,
  startIcon,
  label,
  variant = "standard",
  multiline,
  helpText,
  resetValue,
  endIcon,
  children,
  sx,
  className,
  ...props
}: TextFieldProps) {
  const style = useStyle(sx);

  const classes_wrapper = useClassNames({
    component_name: "TextField_Wrapper",
    variant: variant,
    state: [color],
    className,
  });
  const classes_label = useClassNames({
    component_name: "TextField_label",
    variant: variant,
    state: [color],
  });

  const classes_box = useClassNames({
    component_name: "TextField_Box",
    variant: variant,
    state: [color],
  });

  const classes_animationWrapper = useClassNames({
    component_name: "TextField_AnimationWrapper",
    variant: variant,
    state: [color],
  });
  const classes_animationStyle = useClassNames({
    component_name: "TextField_AnimationStyle",
    variant: variant,
    state: [color],
  });

  const classes_fieldSet = useClassNames({
    component_name: "TextField_FieldSet",
    variant: variant,
    state: [color],
  });

  const classes_legend = useClassNames({
    component_name: "TextField_legend",
    variant: variant,
    state: [color],
  });

  const classes_helpText = useClassNames({
    component_name: "TextField_helpText",
    variant: variant,
    state: [color],
  });
  const idFromUseId = useId();
  const customIDForLabel = props.id || idFromUseId;

  return (
    <div style={style.styleFromSx} className={classes_wrapper.combined}>
      <label className={classes_label.combined} htmlFor={customIDForLabel}>
        {label}
      </label>
      <div className={classes_box.combined}>
        {variant == "standard" && (
          <div className={classes_animationWrapper.combined}>
            <div className={classes_animationStyle.combined}></div>
          </div>
        )}
        {startIcon && <span className="MUI_StartIcon">{startIcon}</span>}
        <InputBase id={customIDForLabel} variant={variant} {...props} />
        {children}
        {variant == "outlined" && (
          <fieldset className={classes_fieldSet.combined}>
            <legend className={classes_legend.combined}>
              <span>{label}</span>
            </legend>
          </fieldset>
        )}
        {endIcon && <span className="MUI_EndIcon">{endIcon}</span>}
      </div>
      {helpText && <p className={classes_helpText.combined}>{helpText}</p>}
    </div>
  );
}

export default TextField;
