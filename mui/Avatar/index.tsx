import { useClassNames, useStyle } from "../../common/theme";
import { useValueOverRide, type MuiElementType } from "../../common/utils";
import { useMemo, useState } from "react";

export type MuiAvatarProps = {
  children: any;
  src?: string;
  alt?: string;
} & MuiElementType<HTMLDivElement>;

export default function Avatar({
  sx,
  className,
  children,
  src,
  alt,
  size,
  ...props
}: MuiAvatarProps) {
  const _style = useStyle(sx);
  const root = useClassNames({
    component_name: "Avatar_Root",
    className,
  });
  const [fallback, setFallback] = useState(false);

  return (
    <div className={root.combined} style={_style.styleFromSx} {...props}>
      {src && !fallback ? (
        <img src={src} alt={alt} onError={() => setFallback(true)} />
      ) : (
        children
      )}
    </div>
  );
}

export type AvatarGroupProps = {
  children?: any;
  max?: number;
  total?: number;
  renderSurplus?: (surplus: number) => any;
  spacing?: "small" | "medium" | number;
} & MuiElementType<HTMLDivElement>;

export function AvatarGroup({
  children,
  max,
  total,
  renderSurplus,
  spacing,
  sx,
  className,
  ...props
}: AvatarGroupProps) {
  const Group = useClassNames({
    component_name: "Avatar_Group_Root",
    className,
  });

  const spacingToValue = useMemo(() => {
    switch (spacing) {
      case undefined:
        return undefined;
      case "small":
        return "-16px";
      case "medium":
        return "-8px";
      default:
        return `${spacing}px`;
    }
  }, [spacing]);

  const spaceOverRide = useValueOverRide({
    valueOverRide: spacingToValue,
    variable: "--spacing-override",
  });
  const style = useStyle(sx);

  const _children: Array<any> = Array.isArray(children) ? children : [children];

  const showedChildren = max ? _children.slice(0, max) : _children;

  const surplus = useMemo(() => {
    return max && typeof total == "undefined"
      ? _children.length - max
      : total || 0;
  }, [_children.length, max]);

  return (
    <div
      className={Group.combined}
      style={{
        ...style.styleFromSx,
        ...spaceOverRide,
      }}
      {...props}
    >
      {surplus > 0 && (
        <Avatar className="bg-slate-500">
          {renderSurplus?.(surplus) || `+${surplus}`}
        </Avatar>
      )}
      {showedChildren}
    </div>
  );
}
