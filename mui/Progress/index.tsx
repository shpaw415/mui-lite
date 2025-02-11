import { useClassNames, useStyle } from "@/common/theme";
import type { MuiElementColors, MuiElementType } from "@/common/utils";

import CircularProgressIcon from "./circulare-progress.svg";
import { useMemo, type CSSProperties } from "react";

export type CircularProgressProps = {
  color?: MuiElementColors;
  size?: number | string;
  variant?: "determinate" | "indeterminate";
  /** 0 to 100 */
  value?: number;
} & Omit<MuiElementType<HTMLDivElement>, "size" | "value">;

export function CircularProgress({
  color,
  sx,
  size = 3,
  variant,
  value,
  ...props
}: CircularProgressProps) {
  const root = useClassNames({
    component_name: "Circular_Progress_Root",
    state: [color, variant],
  });
  const style = useStyle(sx);

  const calculatedValue = useMemo(() => {
    const min = 126.92;
    if (value == 100) return 0;
    else if (value == 0) return min;
    const val = (min - ((((value || 0) * min) / 100) % min)).toPrecision(2);
    return val;
  }, [value]);

  return (
    <div
      className="MUI_Circular_Progress_Wrapper"
      style={{
        ...style.styleFromSx,
        ...{
          "--circular-size": `${typeof size == "number" ? `${size}rem` : size}`,
          "--circular-progress": `${calculatedValue}px`,
        },
      }}
      {...props}
    >
      <span role="progressbar" className={root.combined}>
        <CircularProgressIcon className="MUI_Circular_Progress_Icon" />
      </span>
    </div>
  );
}

export type LinearProgressProps = {
  color?: MuiElementColors;
  colorOverride?: CSSProperties;
  variant?: "determinate" | "indeterminate" | "buffer";
  /** 0 - 100 */
  value?: number;
  /** 0 - 100 */
  valueBuffer?: number;
} & Omit<MuiElementType<HTMLDivElement>, "size" | "value">;

export function LinearProgress({
  sx,
  className,
  color,
  variant = "indeterminate",
  value,
  valueBuffer,
  ...props
}: LinearProgressProps) {
  const style = useStyle(sx);
  const root = useClassNames({
    component_name: "Linear_Progress_Root",
    state: [color, variant],
  });

  const bar = useClassNames({
    component_name: "Linear_Progress_Bar",
    state: [color, variant],
  });

  const dash = useClassNames({
    component_name: "Progress_Buffer_Dash",
    state: [color],
  });

  const determinateValue: CSSProperties | undefined = useMemo(() => {
    if (variant != "determinate" && variant != "buffer") return undefined;
    return {
      transform: `translateX(-${100 - (value || 0)}%)`,
    };
  }, [value, variant]);

  const determinateBufferValue: CSSProperties | undefined = useMemo(() => {
    if (variant != "buffer") return undefined;
    return {
      transform: `translateX(-${100 - (valueBuffer || 0)}%)`,
    };
  }, [valueBuffer, variant]);

  const detereminateBufferDashOffset: CSSProperties = useMemo(() => {
    return {
      transform: `translateX(${valueBuffer || 0}%)`,
    };
  }, [valueBuffer]);

  return (
    <div
      className={"MUI_Linear_Progress_Wrapper" + ` ${className || ""}`}
      style={style.styleFromSx}
      {...props}
    >
      <span
        role="progressbar"
        className={root.combined}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={value}
      >
        {variant == "buffer" && (
          <span
            className={dash.combined}
            style={detereminateBufferDashOffset}
          />
        )}
        <span className={bar.combined} style={determinateValue} />
        {variant == "indeterminate" ||
          (variant == "buffer" && (
            <span className={bar.combined} style={determinateBufferValue} />
          ))}
      </span>
    </div>
  );
}
