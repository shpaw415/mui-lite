import { useClassNames } from "../../common/theme";
import type { MuiElementColors, MuiElementType } from "../../common/utils";
import { useCallback, type JSX } from "react";
import Box from "../Box";

export type BadgeProps = {
  badgeContent?: number | JSX.Element;
  invisible?: boolean;
  /** default 99 */
  max?: number;
  color?: MuiElementColors;
  variant?: "dot";
  overlap?: "circular";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
} & MuiElementType<HTMLSpanElement>;

export default function Badge({
  children,
  className,
  badgeContent,
  invisible,
  max = 99,
  variant,
  overlap,
  position = "top-right",
  ...props
}: BadgeProps) {
  const wrapper = useClassNames({
    component_name: "Badge_Wrapper",
  });
  const root = useClassNames({
    component_name: "Badge_Root",
    className,
    state: [invisible && "invisible", variant, overlap, position],
  });

  const BadgeRender = useCallback(
    (content?: number) => {
      if (
        (typeof variant != "undefined" && variant == "dot") ||
        typeof content == "undefined"
      )
        return "";
      else if (content <= max) return content;
      else return `${max}+`;
    },
    [max, variant]
  );

  return (
    <Box Element="span" className={wrapper.combined}>
      {children}
      <Box Element="span" className={root.combined} {...(props as any)}>
        {typeof badgeContent == "number"
          ? BadgeRender(badgeContent)
          : badgeContent}
      </Box>
    </Box>
  );
}
