"use client";
import { useClassNames } from "../../common/theme";
import { useCallback, useId, useState, type JSX } from "react";
import Typography from "../Typography";
import {
  type MuiElementColors,
  type MuiElementType,
  type SlotProps,
} from "../../common/utils";
import clsx from "clsx";

import CheckboxBorder from "@material-design-icons/svg/filled/check_box_outline_blank.svg";
import CheckboxChecked from "@material-design-icons/svg/filled/check_box.svg";
import IconButton from "../IconButton";
import { useMuiRef } from "../../common/utils";
import Box, { type BoxProps } from "../Box";

type _MuiCheckBox = {
  label?: string;
  labelSide?: "top" | "bottom" | "left" | "right";
  size?: "small" | "medium" | "large";
  color?: MuiElementColors;
  colorOverRide?: React.CSSProperties["color"];
  SlotProps?: SlotProps<{
    container: BoxProps<HTMLDivElement>;
  }>;
} & Omit<MuiElementType<HTMLInputElement>, "size" | "color">;

export type MuiCheckBox =
  | (_MuiCheckBox & {
      icon: JSX.Element;
      checkedIcon: JSX.Element;
    })
  | (_MuiCheckBox & {
      icon?: undefined;
      checkedIcon?: undefined;
    });

export default function CheckBox({
  label,
  size,
  color,
  sx,
  labelSide = "right",
  icon,
  checkedIcon,
  colorOverRide,
  ref,
  SlotProps,
  ...props
}: MuiCheckBox) {
  const _ref = useMuiRef<HTMLInputElement>(ref);

  const wrapper = useClassNames({
    component_name: "Checkbox",
    state: [color, size],
    className: SlotProps?.container?.className,
  });
  const idFromUseId = useId();
  const ID = props.id || "ID_" + idFromUseId;

  const RenderCheck = useCallback(
    ({ checked }: { checked?: boolean }) => {
      if (!icon || !checkedIcon) {
        if (checked) return <CheckboxChecked />;
        else return <CheckboxBorder />;
      } else {
        if (checked) return checkedIcon;
        return icon;
      }
    },
    [icon, checkedIcon]
  );
  const [, setState] = useState(Boolean(props.defaultChecked));

  return (
    <Box
      {...SlotProps?.container}
      className={clsx(
        "flex items-center w-fit h-fit",
        {
          "flex-row": labelSide == "right",
          "flex-col": labelSide == "bottom",
          "flex-row-reverse": labelSide == "left",
          "flex-col-reverse": labelSide == "top",
        },
        wrapper.combined
      )}
    >
      <IconButton
        color={color}
        onClick={() => {
          ref?.current?.click();
          setState((c) => !c);
        }}
        colorOverRide={colorOverRide}
        disabled={props.disabled}
        size={size}
        sx={sx}
        type="button"
      >
        <div className="w-full h-full flex items-center justify-center">
          {RenderCheck({
            checked:
              props.checked == undefined
                ? _ref.current?.checked ?? props.defaultChecked
                : props.checked,
          })}
          <input
            type="checkbox"
            className="top-0 left-0 w-full h-full absolute opacity-0"
            id={ID}
            {...props}
            ref={_ref}
          />
        </div>
      </IconButton>

      {label && (
        <Typography<
          React.DetailedHTMLProps<
            React.LabelHTMLAttributes<HTMLLabelElement>,
            HTMLLabelElement
          >
        >
          Element="label"
          className="ml-1"
          htmlFor={ID}
        >
          {label + (props.required ? "*" : "")}
        </Typography>
      )}
    </Box>
  );
}
