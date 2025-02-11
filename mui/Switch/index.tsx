import { RippleBase } from "@/common/ripple";
import { useClassNames, useStyle, type SxProps } from "@/common/theme";
import type { MuiElementColors } from "@/common/utils";
import { useRef, type RefObject } from "react";

export type MuiSwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "style"
> & {
  label?: string;
  size?: "small";
  color?: MuiElementColors;
  sx?: SxProps;
  ref?: RefObject<HTMLInputElement>;
  labelControl?: boolean;
};

function Switch({
  sx,
  className,
  label,
  color,
  size,
  ref,
  labelControl,
  ...props
}: MuiSwitchProps) {
  const _style = useStyle(sx);
  const _ref = ref || useRef<HTMLInputElement>(null);

  const switchThumb = useClassNames({
    component_name: "Switch_Thumb",
    state: [size, color],
  });

  const input = useClassNames({
    component_name: "Switch_Input",
  });

  const track = useClassNames({
    component_name: "Switch_Track",
    state: [size, color],
  });

  const wrapper = useClassNames({
    component_name: "Switch_Wrapper",
    state: [size],
    className,
  });

  return (
    <div style={_style.styleFromSx} className="h-fit w-fit">
      <span className={wrapper.combined}>
        <span className="MUI_Switch_Button">
          <span className={switchThumb.combined}>
            <input
              className={input.combined}
              ref={_ref}
              type="checkbox"
              {...props}
            />
          </span>
          <RippleBase
            ref={_ref}
            offset={{ left: -25, top: -25 }}
            color="primary"
          />
        </span>
        <span className={track.combined} />
      </span>
      {label && (
        <span
          className="MUI_switch_label"
          onClick={labelControl ? () => _ref.current?.click() : undefined}
        >
          {label}
          {props.required ? "*" : ""}
        </span>
      )}
    </div>
  );
}

export default Switch;
