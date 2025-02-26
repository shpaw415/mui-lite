import { useClassNames, useStyle, type SxProps } from "../../common/theme";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DetailsHTMLAttributes,
  type RefObject,
} from "react";
import { useMouseMoveListener, useMouseUpListener } from "../../common/utils";
import ToolTip from "../ToolTip";

type SliderProps = Omit<
  DetailsHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "onChange" | "style"
> & {
  disabled?: boolean;
  readOnly?: boolean;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (values: number[]) => void;
  value?: number | number[];
  defaultValue?: number | number[];
  valueLabelDisplay?: "on" | "auto";
  valueLabelFormat?: (value: number) => number;
  valueLabelPosition?: "top" | "bottom";
  sx?: SxProps;
  ref?: RefObject<HTMLInputElement>;
  toolTip?: boolean;
};

function Slider({
  className,
  readOnly,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  sx,
  value,
  defaultValue,
  valueLabelDisplay,
  valueLabelFormat,
  valueLabelPosition,
  toolTip,
  ...props
}: SliderProps) {
  if (value != undefined && !Array.isArray(value)) value = [value];
  if (defaultValue != undefined && !Array.isArray(defaultValue))
    defaultValue = [defaultValue];

  const _style = useStyle(sx);
  const rootRef = useRef<HTMLSpanElement>(null);
  const totalLength = useMemo(() => Math.abs(min) + Math.abs(max), [min, max]);
  const toPercent = useCallback<(value: number) => number>((val) => {
    return (Math.abs(min - val) * 100) / totalLength;
  }, []);
  const fromPercent = useCallback<(value: number) => number>((val) => {
    const valFromPercent = (val * totalLength) / 100 + min;
    return valFromPercent;
  }, []);

  const [selected, setSelected] = useState([false, false]);
  const [_value_, setValue] = useState(() => {
    if (value) {
      return value.map((e) => toPercent(e));
    }
    if (defaultValue) {
      return defaultValue.map((e) => toPercent(e));
    }
    return [toPercent(defaultValue ?? min)];
  });

  const valuesToUse =
    (value as number[] | undefined)?.map((e) => toPercent(e)) ?? _value_;

  useMouseUpListener(() => {
    if (props.disabled) return;
    setSelected([false, false]);
  }, [props.disabled]);
  let cumulativeMovement = [0, 0];
  let followUpValues = _value_;
  useEffect(() => {
    valuesToUse.map((val, index) => {
      setTimeout(() => {
        cumulativeMovement[index] =
          (val * (rootRef.current?.offsetWidth || 0)) / 100;
      }, 150);
    });
  }, []);
  useMouseMoveListener((e) => {
    if (e.buttons == 0 || props.disabled) return;
    let hasSelect = false;
    setSelected((current) => {
      if (!current.includes(true)) return current;
      else if (e.buttons == 0) return [false, false];
      const indexOfSelected = current.indexOf(true);
      hasSelect = true;
      const rootWidth = rootRef.current?.offsetWidth || 0;

      if (cumulativeMovement[indexOfSelected] + e.movementX < 0)
        cumulativeMovement[indexOfSelected] = 0;
      else if (cumulativeMovement[indexOfSelected] + e.movementX > rootWidth)
        cumulativeMovement[indexOfSelected] = rootWidth;
      else if (
        indexOfSelected == 0 &&
        followUpValues.filter((e) => e != undefined).length > 1 &&
        cumulativeMovement[0] + e.movementX > cumulativeMovement[1]
      ) {
      } else if (
        indexOfSelected == 1 &&
        followUpValues.filter((e) => e != undefined).length > 1 &&
        cumulativeMovement[1] + e.movementX < cumulativeMovement[0]
      ) {
      } else cumulativeMovement[indexOfSelected] += e.movementX;

      followUpValues = current.map((val, index) => {
        if (val == false) return followUpValues[index];
        return Math.round(
          (cumulativeMovement[indexOfSelected] * 100) / rootWidth
        );
      });

      if (!value) setValue(followUpValues);
      return current;
    });
    hasSelect &&
      onChange &&
      onChange(
        followUpValues
          .filter((e) => Number.isInteger(e))
          .map((e) => fromPercent(e))
      );
  });
  const root = useClassNames({
    component_name: "Slider_Root",
    className,
  });

  let styleForTrack: CSSProperties = {};
  if (!value && defaultValue && (defaultValue as number[]).length > 1) {
    styleForTrack.width = `${_value_[1] - _value_[0]}%`;
    styleForTrack.left = `${_value_[0]}%`;
  } else if (!value) {
    styleForTrack.width = `${_value_[0]}%`;
  } else if (Array.isArray(value) && value.length == 2) {
    styleForTrack.width = `${toPercent(value[1]) - toPercent(value[0])}%`;
    styleForTrack.left = `${toPercent(value[0])}%`;
  } else styleForTrack.width = `${toPercent(value[0])}%`;

  return (
    <span className={root.combined} style={_style.styleFromSx} ref={rootRef}>
      <span className="MUI_Slider_Rail" />
      <span className="MUI_Slider_Track" style={styleForTrack} />

      {valuesToUse
        .filter((e) => e != undefined)
        .map((value, index) => (
          <ToolTip
            title={(
              (valueLabelFormat && valueLabelFormat(fromPercent(value))) ??
              fromPercent(value)
            ).toString()}
            position="top"
            trigger={valueLabelDisplay == "on" ? "on" : "onMouseDown"}
            key={index}
            sx={{
              translate: "-11px 15px",
              display: !toolTip ? "none" : undefined,
            }}
          >
            <span
              className="MUI_Slider_Thumb"
              style={{ left: `${value}%` }}
              onMouseDown={(e) => {
                setSelected(
                  selected.map((e, _index_) =>
                    index == _index_ ? true : false
                  )
                );
              }}
            >
              <input
                type="range"
                className="MUI_Slider_Input"
                readOnly={readOnly}
                min={min}
                max={max}
                step={step}
                value={fromPercent(value)}
                {...props}
              />
            </span>
          </ToolTip>
        ))}
    </span>
  );
}

export default Slider;
