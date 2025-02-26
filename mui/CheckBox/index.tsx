"use client";
import { useClassNames, useStyle } from "../../common/theme";
import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import Typography from "../Typography";
import {
  useRandomID,
  type MuiElementColors,
  type MuiElementType,
} from "../../common/utils";
import clsx from "clsx";

import CheckboxBorder from "@svg/filled/check_box_outline_blank.svg";
import CheckboxChecked from "@svg/filled/check_box.svg";
import IconButton from "../IconButton";
import { useMuiRef } from "../../common/utils";

type _MuiCheckBox = {
  label?: string;
  labelSide?: "top" | "bottom" | "left" | "right";
  size?: "small" | "medium" | "large";
  color?: MuiElementColors;
  colorOverRide?: React.CSSProperties["color"];
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
  ...props
}: MuiCheckBox) {
  const ref = useMuiRef(props.ref);

  const wrapper = useClassNames({
    component_name: "Checkbox",
    state: [color, size],
  });

  const ID = props.id || "ID_" + useRandomID();

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
  const [, setState] = useState(false);
  useEffect(() => {
    const onChangeHandler = () => setState((c) => !c);
    ref.current?.addEventListener("change", onChangeHandler);

    return () => {
      ref.current?.removeEventListener("change", onChangeHandler);
    };
  }, []);

  return (
    <div
      className={
        clsx("flex items-center w-fit h-fit", {
          "flex-row": labelSide == "right",
          "flex-col": labelSide == "bottom",
          "flex-row-reverse": labelSide == "left",
          "flex-col-reverse": labelSide == "top",
        }) + ` ${wrapper.combined}`
      }
    >
      <IconButton
        onClick={() => ref.current?.click()}
        color={color}
        colorOverRide={colorOverRide}
        disabled={props.disabled}
        size={size}
        sx={sx}
      >
        <RenderCheck
          checked={
            typeof props.checked == "undefined"
              ? ref.current?.checked
              : props.checked
          }
        />
        <input
          type="checkbox"
          className="h-full w-full opacity-0 absolute top-0 left-0"
          id={ID}
          {...props}
          ref={ref}
        />
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
    </div>
  );
}
