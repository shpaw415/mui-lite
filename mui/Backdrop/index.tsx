import { useClassNames, useStyle } from "@/common/theme";
import type { MuiElementType } from "@/common/utils";

export type BackdropProps = {
  open?: boolean;
} & MuiElementType<HTMLDivElement>;

export default function Backdrop({
  sx,
  open,
  className,
  ...props
}: BackdropProps) {
  const style = useStyle(sx, {
    opacity: {
      backgroundColor: 0.5,
    },
  });

  const root = useClassNames({
    component_name: "Backdrop_Root",
    state: [open && "opened"],
  });

  return (
    <div
      aria-hidden={!open}
      style={style.styleFromSx}
      className={root.combined}
      {...props}
    />
  );
}
