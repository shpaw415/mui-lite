import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  type RefObject,
  createContext,
  useContext,
  useMemo,
} from "react";
import { useClassNames, useStyle, type SxProps } from "./theme";
import { useColorOverRide, type MuiElementColors } from "./utils";

interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  offset?: {
    top: number;
    left: number;
  };
  disabled?: boolean;
  elRef?: RefObject<any>;
  sx?: SxProps;
}

const RippleContext = createContext<RefObject<HTMLDivElement | null>>(
  {} as any
);

const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  className = "",
  onClick,
  offset,
  disabled,
  elRef,
  sx,
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const style = useStyle(sx);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    if (onClick) onClick(e);

    const container = containerRef.current;
    if (!container) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const size = Math.max(width, height);
    const x = e.clientX - left - size / 2 + (offset?.left || 0);
    const y = e.clientY - top - size / 2 + (offset?.top || 0);

    setRipples((prevRipples) => [...prevRipples, { x, y }]);
  }, []);

  useEffect(() => {
    if (ripples.length > 0) {
      const timeout = setTimeout(() => {
        setRipples([]);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [ripples]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden inline-flex items-center justify-center ${className}`}
      style={style.styleFromSx}
      onClick={handleClick}
    >
      <RippleContext value={containerRef}>{children}</RippleContext>
      {ripples.map((ripple, index) => (
        <span
          key={index}
          onClick={() => elRef?.current.click()}
          className="absolute rounded-full bg-current opacity-40 animate-ripple w-[100px] h-[100px]"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            animationDuration: "600ms",
          }}
        />
      ))}
    </div>
  );
};

function RippleBase({
  disabled,
  offset,
  ref,
  clickRef,
  sx,
  className,
  color,
  colorOverRide,
  preventClickElement,
}: {
  disabled?: boolean;
  offset?: {
    top: number;
    left: number;
  };
  ref: RefObject<HTMLElement | null>;
  clickRef?: RefObject<HTMLElement | null>;
  sx?: SxProps;
  className?: string;
  color?: MuiElementColors;
  colorOverRide?: React.CSSProperties["color"];
  preventClickElement?: boolean;
}) {
  const [ripples, setRipples] = useState<{ x: number; y: number }[]>([]);
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    clickRef?.current?.click();
    const container = ref.current;
    if (!container) return;
    !preventClickElement && container.click();

    const { left, top, width, height } = container.getBoundingClientRect();
    const size = Math.max(width, height);
    const x = e.clientX + 75 - left - size / 2 + (offset?.left || 0);
    const y = e.clientY + 75 - top - size / 2 + (offset?.top || 0);

    setRipples((prevRipples) => [...prevRipples, { x, y }]);
  }, []);

  useEffect(() => {
    if (ripples.length > 0) {
      const timeout = setTimeout(() => {
        setRipples([]);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [ripples]);

  useEffect(() => {
    const ev: any = (e: React.MouseEvent) => {
      handleClick(e);
    };
    ref.current?.addEventListener("click", ev);

    return () => {
      ref.current?.removeEventListener("click", ev);
    };
  }, []);

  const style = useStyle(sx);

  const rippleClass = useClassNames({
    component_name: "Ripple",
    state: [color],
    className,
  });

  const overRide = useColorOverRide({ colorOverRide });

  return ripples.map((ripple, index) => (
    <span
      key={index}
      className={`absolute rounded-full bg-current opacity-40 animate-ripple w-[100px] h-[100px] ${rippleClass.combined}`}
      style={{
        left: `${ripple.x}px`,
        top: `${ripple.y}px`,
        ...overRide,
        ...style.styleFromSx,
      }}
      onClick={handleClick}
    />
  ));
}

function useRipple() {
  const context = useContext(RippleContext);
  return () => context.current?.click();
}

export default RippleEffect;
export { useRipple, RippleBase };
