import { useStyle, type SxProps } from "../../common/theme";
import Typography from "../Typography";
import FrameSVG from "./Radio-frame.svg";
import ButtonSVG from "./Radio-btn.svg";
import RippleEffect from "../../common/ripple";
import type { RefObject } from "react";

type RadioButtonProps = {
  checked?: boolean;
  label?: string;
  labelDirection?: "top" | "right" | "bottom" | "left";
  disabled?: boolean;
  color?: "error" | "success";
  sx?: SxProps;
  ref?: RefObject<HTMLInputElement>;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export default function Radio({
  sx,
  className,
  label,
  color,
  labelDirection,
  ...props
}: RadioButtonProps) {
  const style = useStyle(sx);

  return (
    <div>
      <RippleEffect
        className="MUI_RadioButton_frame"
        offset={{ left: -25, top: -25 }}
      >
        <input type="checkbox" className="MUI_radio_input" {...props} />
        <div className="MUI_Radio_Inner" style={style.styleFromSx}>
          <FrameSVG className="MUI_Radio_SVG_Frame" />
          <ButtonSVG className="MUI_Radio_SVG_Button" />
        </div>
      </RippleEffect>
    </div>
  );
}
