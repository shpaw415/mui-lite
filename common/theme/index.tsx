"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type RefObject,
} from "react";
import {
  ColorToRGBArray,
  RGBAArrayToRGB,
  useMediaQuery,
  useRandomID,
  type MuiElementType,
} from "../utils";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { type SupportedLocalesType } from "../../mui/locale/index";

export let MuiIds: string[] = [];
export let MuiStyleVariables: {
  id: string;
  values: Record<MuiTheme["theme"], string>;
}[] = [];
export let MuiVariableTimer: Timer;

export type MediaQueryType = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export type SxColorTheme = Partial<Record<ThemeKeys, keyof Schemes | "theme">>;
export type SxCSSProperty = {
  [K in keyof CSSProperties]?: CSSProperties[K] | SxColorTheme;
};
type SxMediaQueryType = Partial<
  Record<keyof MediaQueryType, CSSProperties | SxCSSProperty>
>;

export type SxProps = SxCSSProperty & SxMediaQueryType;

export const MediaQueryValuesContext = createContext<MediaQueryType>({
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
});
export const MediaQueryKeys: Array<keyof MediaQueryType> = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
];

export function MediaQueryProvider({
  value,
  children,
}: {
  value: MediaQueryType;
  children: any;
}) {
  return (
    <MediaQueryValuesContext value={value}>{children}</MediaQueryValuesContext>
  );
}

export class MuiBaseStyleUtils<Variant, suffixesType> {
  static extractColorToRGB(colorData: string): number[] {
    if (colorData.startsWith("#")) {
      const rgb = this.hexToRgb(colorData);
      if (!rgb) throw new Error(`${colorData} is not a valid Hex color format`);
      return rgb;
    }
    let maybeRGBA = this.extractCssRGB(colorData);
    if (maybeRGBA.length == 3) return maybeRGBA;
    maybeRGBA.pop();
    return maybeRGBA;
  }
  public rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  /**
   * @returns [0-255, 0-255, 0-255]
   */
  static hexToRgb(
    hex: string,
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  ) {
    return result ? result.map((i) => parseInt(i, 16)).slice(1) : null;
  }
  /**
   * @returns [0-255, 0-255, 0-255, 0.0-1.0]
   */
  static extractCssRGB(rgbString: string) {
    return rgbString
      .split("(")[1]
      .split(")")[0]
      .split(",")
      .map((e) => (e.includes(".") ? parseFloat(e) : parseInt(e)));
  }
}

export function extractColorFromSxColorTheme(
  theme: MuiTheme,
  currentTheme: keyof Schemes,
  sx: SxColorTheme
): CSSProperties["color"] {
  const key = Object.keys(sx)[0] as keyof SxColorTheme;
  if (sx[key] == "theme") return theme[key][currentTheme];
  if (sx[key] == undefined) return "" as CSSProperties["color"];
  return theme[key][sx[key]];
}

export function sxToStyle(
  theme: MuiTheme,
  currentTheme: keyof Schemes,
  mediaQuerySize?: keyof MediaQueryType,
  sxProps?: SxProps
): Partial<React.CSSProperties> {
  if (!sxProps) return {};
  const StyleKeys = Object.keys(sxProps) as Array<keyof SxProps>;
  let hasSxMediaQueryKey = mediaQuerySize && StyleKeys.includes(mediaQuerySize);
  const ReturnAndSet = (key: keyof MediaQueryType) => {
    hasSxMediaQueryKey = true;
    return sxProps[key] as Partial<SxCSSProperty>;
  };
  const sxPropsAsMediaQuery = StyleKeys.map((key) => {
    if (key == mediaQuerySize) return sxProps[key];
    else if (MediaQueryKeys.includes(key as keyof MediaQueryType)) {
      if (hasSxMediaQueryKey || !mediaQuerySize) return undefined;
      else if (mediaQuerySize == "xs") {
        if (sxProps?.sm) return ReturnAndSet("sm");
        else if (sxProps?.md) return ReturnAndSet("md");
        else if (sxProps?.lg) return ReturnAndSet("lg");
      } else if (mediaQuerySize == "sm") {
        if (sxProps?.md) return ReturnAndSet("md");
        else if (sxProps?.lg) return ReturnAndSet("lg");
      } else if (mediaQuerySize == "md") {
        if (sxProps?.lg) return ReturnAndSet("lg");
      }
    } else if (
      mediaQuerySize &&
      typeof sxProps[mediaQuerySize] != "undefined" &&
      typeof (sxProps[mediaQuerySize] as any)[key] != "undefined"
    ) {
      return { [key]: (sxProps[mediaQuerySize] as any)[key] };
    } else return { [key]: sxProps[key] };
  }).filter((e) => e != undefined) as Array<Partial<SxCSSProperty>>;

  return Object.assign(
    {},
    ...sxPropsAsMediaQuery.map((obj) => {
      const key = Object.keys(obj)[0] as keyof SxCSSProperty;
      const val = obj[key];

      if (typeof val != "object") return { [key]: val };
      return (Object.keys(val) as Array<ThemeKeys>)
        .map((k) => {
          const color = val[k] as keyof Schemes | "theme";
          if (color == "theme") {
            return { [key]: theme[k][currentTheme] };
          }
          return { [key]: theme[k][color] };
        })
        .at(0);
    })
  );
}

export type Schemes = {
  light: Exclude<React.CSSProperties["color"], undefined>;
  dark: Exclude<React.CSSProperties["color"], undefined>;
  main: Exclude<React.CSSProperties["color"], undefined>;
};

type bgThemeKeys =
  | "bg-primary"
  | "bg-secondary"
  | "bg-error"
  | "bg-success"
  | "bg-warning"
  | "bg-main"
  | "bg-surface";

type colorThemeKeys =
  | "text-primary"
  | "text-main"
  | "text-secondary"
  | "text-error"
  | "text-success"
  | "text-warning"
  | "text-info";

type ThemeKeys = bgThemeKeys | colorThemeKeys;

export type MuiTheme = Record<ThemeKeys, Schemes> & {
  theme: "light" | "dark";
  locale: SupportedLocalesType;
};

export const DefaultTheme: MuiTheme = {
  "bg-surface": {
    light: "#ffffff",
    dark: "#121212",
    main: "#a3a3a3",
  },
  "bg-primary": {
    light: "#42a5f5",
    dark: "#1565c0",
    main: "#1976d2",
  },
  "bg-main": {
    dark: "#0f1214",
    light: "#ffffff",
    main: "#ffffff",
  },
  "bg-secondary": {
    light: "#ba68c8",
    dark: "#7b1fa2",
    main: "#9c27b0",
  },
  "bg-success": {
    light: "#4caf50",
    dark: "#1b5e20",
    main: "#2e7d32",
  },
  "bg-error": {
    light: "#ef5350",
    dark: "#c62828",
    main: "#d32f2f",
  },
  "bg-warning": {
    light: "#ed6c02",
    dark: "#f77102",
    main: "#db6809",
  },
  "text-primary": {
    light: "#42a5f5",
    dark: "#1565c0",
    main: "#1976d2",
  },
  "text-warning": {
    light: "#ed6c02",
    dark: "#f77102",
    main: "#db6809",
  },
  "text-main": {
    light: "#000000",
    dark: "#ffffff",
    main: "#333",
  },
  "text-secondary": {
    light: "#aa00ff",
    dark: "#d500f9",
    main: "#d400fa",
  },
  "text-error": {
    light: "#e57373",
    dark: "#d32f2f",
    main: "#f44336",
  },
  "text-success": {
    light: "#81c784",
    dark: "#388e3c",
    main: "#66bb6a",
  },
  "text-info": {
    light: "#03a9f4",
    dark: "#01579b",
    main: "#0288d1",
  },
  theme: "light",
  locale: "enUS",
};

export const zIndex = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

export const MuiColors = createContext<MuiTheme>(structuredClone(DefaultTheme));

type ApplyStyle = {
  opacity: Partial<Record<keyof CSSProperties, number>>;
};

function StyleApplier(sx: Partial<CSSProperties>, apply?: Partial<ApplyStyle>) {
  if (!apply) return sx;
  if (!sx) return {};
  const sxCopy = structuredClone(sx);
  const applierKeys = Object.keys(apply) as Array<keyof ApplyStyle>;
  applierKeys.map((key) => {
    switch (key) {
      case "opacity":
        (
          Object.keys((apply as ApplyStyle)[key]) as Array<keyof CSSProperties>
        ).map((k) => {
          if (typeof sxCopy[k] != "string") return;
          sxCopy[k] = `rgba(${RGBAArrayToRGB(
            ColorToRGBArray(sxCopy[k] as string)
          ).join(", ")}, ${apply[key]?.[k]})` as any;
        });
    }
  });
  return sxCopy;
}

export function useStyle(sxProps?: SxProps, apply?: Partial<ApplyStyle>) {
  const theme = useContext(MuiColors);
  const mediaQuery = useMediaQuery();
  const [currentSx, setSx] = useState<keyof MediaQueryType>(mediaQuery);
  useEffect(() => {
    if (currentSx != mediaQuery) setSx(mediaQuery);
  }, [mediaQuery]);

  const currentSxJson = JSON.stringify(sxProps);

  const memorizedStyleFromSx = useMemo(
    () =>
      StyleApplier(sxToStyle(theme, theme.theme, currentSx, sxProps), apply),
    [currentSx, currentSxJson, theme.theme]
  );

  return {
    theme: theme,
    styleFromSx: memorizedStyleFromSx,
  };
}

type MuiVariableData = {
  id: string;
  values: Record<MuiTheme["theme"], string>;
}[];

export const MuiVariableUpdater = createContext<
  React.Dispatch<React.SetStateAction<MuiVariableData>>
>(() => {});

const muiThemeExclude = ["theme", "locale"];
type muiThemeWithoutExcludedType = keyof Omit<MuiTheme, "theme" | "locale">;

function ArrToStr(val: [number, number, number, number]) {
  if (!Array.isArray(val) || val.length < 3) return undefined;
  return [val.at(0), val.at(1), val.at(2)].join(", ");
}
export function ThemeToCssVar(theme: MuiTheme) {
  const currentTheme = theme.theme;
  const { fromString } = require("css-color-converter") as {
    fromString: (val: string) => any;
  };
  return (
    (Object.keys(theme) as Array<keyof MuiTheme>).filter(
      (e) => !muiThemeExclude.includes(e)
    ) as Array<muiThemeWithoutExcludedType>
  )
    .map((key) => {
      let rgbArray: [number, number, number, number] = fromString(
        theme[key][currentTheme]
      )?.toRgbaArray?.();
      const currentColor = `--${key}: ${rgbArray && ArrToStr(rgbArray)};`;

      rgbArray = fromString(theme[key].light)?.toRgbaArray?.();
      const light = `--${key}-light: ${rgbArray && ArrToStr(rgbArray)}`;

      rgbArray = fromString(theme[key].dark)?.toRgbaArray?.();
      const dark = `--${key}-dark: ${rgbArray && ArrToStr(rgbArray)}`;

      rgbArray = fromString(theme[key].main)?.toRgbaArray?.();
      const main = `--${key}-main: ${rgbArray && ArrToStr(rgbArray)}`;

      return `${currentColor};\n${light};\n${dark};\n${main};`.replace(
        ";;",
        ";"
      );
    })
    .join("\n");
}

export function useClassNames<Variant extends string, State, T extends {}>({
  variant,
  state,
  component_name,
  className,
  overRide,
}: {
  variant?: Variant;
  state?: State[];
  component_name: string;
  className?: ClassValue;
  overRide?: Partial<T>;
}) {
  const calculated = useCallback(
    (state?: State[]) => {
      const componentName = "MUI_" + component_name;
      if (!state) state = [];
      const _state = [
        ...state
          .filter((e) => e)
          .map((state) => [
            variant &&
              `MUI_${component_name}_${state}${variant ? `_${variant}` : ""}`,
            `MUI_${component_name}_${state}`,
            `_${state}`,
          ])
          .reduce((p, n) => [...p, ...n], []),
        className || "",
        variant && `MUI_${component_name}_${variant}`,
        (overRide as any)?.className && (overRide as any).className,
        componentName,
      ].filter((e) => e);
      return {
        component: componentName,
        combined: _state.join(" "),
        states: _state,
      };
    },
    [variant, className]
  );

  const calculatedValue = useMemo(
    () => calculated(state),
    [state, className, variant]
  );

  return calculatedValue;
}

export type ThemeProviderProps = {
  WrapperElement?: ElementType;
  theme: MuiTheme;
} & MuiElementType<HTMLElement>;

const ValueUpdateContext = createContext<
  [
    ((theme: MuiTheme) => void)[],
    React.Dispatch<React.SetStateAction<((theme: MuiTheme) => void)[]>>
  ]
>([() => {}, () => {}] as any);

export const ThemeWrapperRefContext =
  createContext<RefObject<HTMLElement | null> | null>(null);

export function ThemeProvider({
  children,
  theme,
  sx,
  WrapperElement = "main",
  className,
  ...props
}: ThemeProviderProps) {
  const style = useStyle(sx);
  const [currentTheme, setCurrentTheme] = useState(
    structuredClone(DefaultTheme)
  );
  const updateCallbacks = useState<Array<(theme: MuiTheme) => void>>([]);
  const json = JSON.stringify(theme);
  useEffect(() => setCurrentTheme(theme), [json]);
  const wrapperRef = useRef<HTMLElement>(props?.ref?.current || null);
  const id = "THEME_" + useRandomID().substring(0, 9);
  return (
    <MuiColors value={currentTheme}>
      <style type="text/css">
        {`.${id}`}
        {`{\n${ThemeToCssVar(currentTheme)}\n}`}
      </style>
      <WrapperElement
        {...props}
        className={clsx(id, `MUI_Theme_Wrapper MUI_${theme.theme}`, className)}
        style={style.styleFromSx}
        ref={wrapperRef}
      >
        <ValueUpdateContext value={updateCallbacks}>
          <ThemeWrapperRefContext value={wrapperRef}>
            {children}
          </ThemeWrapperRefContext>
        </ValueUpdateContext>
      </WrapperElement>
    </MuiColors>
  );
}

/** set To light at first run or there will be hydration error */
export function useTheme(
  updateCallback?: (theme: MuiTheme) => void,
  deps?: React.DependencyList
) {
  const colorContext = useContext(MuiColors);
  const [, setCallback] = useContext(ValueUpdateContext);
  useEffect(() => {
    setCallback((e) => {
      updateCallback && e.push(updateCallback);
      return e;
    });
    return () => {
      setCallback((e) => {
        updateCallback && e.splice(e.indexOf(updateCallback, 1));
        return e;
      });
    };
  }, deps);
  const [, set] = useState<MuiTheme["theme"]>("light");
  useEffect(() => {
    set(colorContext.theme);
  }, [colorContext.theme]);
  return colorContext;
}

export function SystemTheme(): MuiTheme["theme"] {
  if (
    typeof window == "undefined" ||
    (window.matchMedia &&
      !window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    return "light";
  }
  return "dark";
}
/**
 * will update if the system theme updates SR compatible
 * @returns the current system theme
 */
export function useSystemTheme(): [
  MuiTheme["theme"],
  React.Dispatch<React.SetStateAction<MuiTheme["theme"]>>
] {
  const [current, set] = useState<MuiTheme["theme"]>("light");

  useEffect(() => {
    set(SystemTheme());
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        set(event.matches ? "dark" : "light");
      });
  }, []);

  return [current, set];
}

export const MetaData: React.HTMLProps<HTMLLinkElement>[] = [
  {
    rel: "stylesheet",
    href: undefined,
  },
];
