import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
  type ReactNode,
  type RefObject,
} from "react";
import {
  MediaQueryToNumbers,
  MediaQueryValuesContext,
  ThemeWrapperRefContext,
  type MediaQueryType,
  type SxProps,
} from "./theme";
import { createPortal } from "react-dom";

const makeRand = () => Math.random().toString(36).slice(2, -1);

export function randomUUID() {
  return `${makeRand()}-${makeRand()}-${makeRand()}-${makeRand()}`.toUpperCase();
}
export function randomString(len: number, unauthorized: string[] = []) {
  let str = "";
  while (str.length < len) {
    str += Array.from(makeRand())
      .filter((e) => !unauthorized.includes(e))
      .join("");
  }
  return str.slice(0, len);
}
/** Test for a typeof React Element type */
export function Expect(
  Element: React.ReactNode,
  TestingElements: React.ReactNode | React.ReactNode[]
) {
  if (Array.isArray(TestingElements)) {
    for (const i of TestingElements) {
      if ((i as any).type != (Element as any).type) return false;
    }
    return true;
  }
  return (TestingElements as any).type == (Element as any).type;
}

export function specialCharToUnderScore(str: string) {
  const replace = Array.from("~!@#$%^&*()=+/*`,.;'[]{}:\"?><|\\");
  let newStr = `${str}`;
  for (const r of replace) {
    newStr = newStr.replaceAll(r, "_");
  }
  return newStr;
}
/**
 *
 * @param callback the function that will be called when a click occur
 * @returns the ref object to set to the element that do not trigger the callback
 */
export function useClickAwayListener<RefType extends HTMLElement>(
  callback: (ev: MouseEvent) => void,
  {
    deps,
    ...props
  }: {
    deps?: React.DependencyList;
    ref?: RefObject<RefType | null>;
  }
) {
  const ref = useMuiRef(props.ref);

  useEffect(() => {
    let currentClick = false;

    const onElementClick = (ev: MouseEvent) => {
      currentClick = true;
    };

    const onDocumentClick = (ev: MouseEvent) => {
      if (currentClick) {
        currentClick = false;
      } else {
        if (!ref.current?.contains(ev.currentTarget as HTMLDivElement))
          callback(ev);
      }
    };
    ref.current?.addEventListener("click", onElementClick);
    document.addEventListener("click", onDocumentClick);

    return () => {
      ref.current?.removeEventListener("click", onElementClick);
      document.removeEventListener("click", onDocumentClick);
    };
  }, [...(deps || []), ref.current]);

  return ref as React.RefObject<RefType & HTMLDivElement>;
}

/**
 * @param callback the function that will be called when a mouseUp occure
 */
export function useMouseUpListener(
  callback: (ev: MouseEvent) => void,
  deps: React.DependencyList
) {
  useEffect(() => {
    document.addEventListener("mouseup", callback);
    return () => {
      document.removeEventListener("mouseup", callback);
    };
  }, deps);
}

/**
 * @param callback the function that will be called when a mouseUp occure
 */
export function useMouseMoveListener(callback: (ev: MouseEvent) => void) {
  useEffect(() => {
    document.addEventListener("mousemove", callback);
    return () => {
      document.removeEventListener("mousemove", callback);
    };
  }, []);
}

/**
 * @param callback the function that will be called when a window resize occure
 */
export function useMediaQuery() {
  const mediaQuery = useContext(MediaQueryValuesContext);
  const [currentSx, setSxType] = useState<keyof MediaQueryType>("md");

  useEffect(() => {
    const callback = () => {
      const w = window.innerWidth;
      for (const query of Object.keys(mediaQuery).reverse() as Array<
        keyof MediaQueryType
      >) {
        if (w >= mediaQuery[query]) return setSxType(query);
      }
    };
    window.addEventListener("resize", callback);

    callback();

    return () => {
      window.removeEventListener("resize", callback);
    };
  }, []);

  return currentSx;
}

/**
 *
 * @param query MediaQuery key to test
 * @param currentQuery The Current MediaQuery key
 * @returns query >= currentQuery: true
 */
export function MediaQueryLessThen(
  query: keyof MediaQueryType,
  currentQuery: keyof MediaQueryType
) {
  return MediaQueryToNumbers[query] >= MediaQueryToNumbers[currentQuery];
}
/**
 *
 * @param query MediaQuery key to test
 * @param currentQuery The Current MediaQuery key
 * @returns query <= currentQuery: true
 */
export function MediaQueryGreaterThen(
  query: keyof MediaQueryType,
  currentQuery: keyof MediaQueryType
) {
  return MediaQueryToNumbers[query] <= MediaQueryToNumbers[currentQuery];
}

export function useRandomID(default_value?: string, len?: number) {
  const [id, setID] = useState(default_value || "");
  useEffect(() => {
    setID(randomString(len || 5, Array.from("1234567890")));
  }, []);
  return id;
}

export type MuiElementType<HTMLType extends HTMLElement> = Exclude<
  React.HTMLProps<HTMLType>,
  "style"
> & {
  sx?: SxProps;
  ref?: RefObject<HTMLType | null>;
};
export type MuiElementColors =
  | "primary"
  | "secondary"
  | "warning"
  | "error"
  | "success";

export function useMuiRef<T>(ref?: RefObject<T | null>) {
  const _ref = useRef<T>(null);
  if (ref != undefined) return ref;
  return _ref;
}

export type ElevationType =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

type R = number;
type G = number;
type B = number;
type A = number;

type RGBAType = [R, G, B, A];

const { fromString } = require("css-color-converter") as {
  fromString: (val: string) => {
    toRgbaArray: () => RGBAType;
  };
};
function ArrToStr(val: RGBAType) {
  return [val[0], val[1], val[2]].join(", ");
}

export function ToGray(val: RGBAType, offset: number): [R, G, B] {
  const upOrDown = val[0] + val[1] + val[2] > 765 / 2;
  return upOrDown
    ? [val[0] - offset, val[1] - offset, val[2] - offset]
    : [val[0] + offset, val[1] + offset, val[2] + offset];
}
function rm(val: number) {
  if (val < 0) return 0;
  return val;
}
function add(val: number) {
  if (val > 255) return 255;
  return val;
}
export function Darker(val: RGBAType, offset: number) {
  return [rm(val[0] - offset), rm(val[1] - offset), rm(val[2] - offset)] as [
    R,
    G,
    B
  ];
}
export function Lighter(val: RGBAType, offset: number) {
  return [add(val[0] + offset), add(val[1] + offset), add(val[2] + offset)] as [
    R,
    G,
    B
  ];
}

type OverRideUtils = {
  ToGray: typeof ToGray;
  Darker: typeof Darker;
  Lighter: typeof Lighter;
};

export function ColorToRGBArray(color: string): RGBAType {
  return fromString(color).toRgbaArray();
}
export function RGBAArrayToRGB(rgba: RGBAType): [R, G, B] {
  return [rgba[0], rgba[1], rgba[2]] as [R, G, B];
}

export function useColorOverRide<T extends string = "--color-override">(
  {
    colorOverRide,
    variable,
    offset,
  }: {
    colorOverRide?: React.CSSProperties["color"];
    variable?: T;
    offset?: (current: RGBAType, utils: OverRideUtils) => [R, G, B];
  },
  deps?: React.DependencyList
): Record<T, "r, g, b"> | undefined {
  const overRideColorHex = useMemo(() => {
    if (!colorOverRide) return undefined;
    const key = (variable ?? "--color-override") as T;
    const RGBAArray = fromString(colorOverRide).toRgbaArray();
    const offsetValues =
      offset?.(RGBAArray, {
        ToGray,
        Darker,
        Lighter,
      }) || RGBAArray;
    return {
      [key]: ArrToStr(offsetValues as RGBAType),
    } as Record<T, "r, g, b">;
  }, [colorOverRide, variable, ...(deps || [])]);

  return overRideColorHex;
}

export function useValueOverRide<T extends string>({
  valueOverRide,
  variable,
}: {
  valueOverRide?: any;
  variable: T;
}): Record<T, string> | undefined {
  return valueOverRide
    ? ({ [variable]: `${valueOverRide}` } as Record<T, string>)
    : undefined;
}

const PropsOverRideContext = createContext<{}>({});
export function PropsOverRideProvider<T extends {}>({
  children,
  props,
}: {
  children?: any;
  props: Partial<T>;
}) {
  return <PropsOverRideContext value={props}>{children}</PropsOverRideContext>;
}

export function usePropsOverRide<T extends {}>(arg: IArguments): Partial<T> {
  const props = useContext(PropsOverRideContext) as T;
  const keyofBypass = (Object.keys(arg[0]) as Array<keyof T>).filter(
    (k) => (arg[0] as unknown as Partial<T>)[k] != undefined
  );
  if (Object.keys(props).length == 0) return {};
  return Object.assign(
    {},
    ...(Object.keys(props as {}) as Array<keyof T>)
      .filter((e) => !keyofBypass.includes(e))
      .map((key) => ({ [key]: props[key] }))
  ) as Partial<T>;
}

export type SlotProps<T extends Partial<Record<string, any>>> = Partial<T>;

/**
 * drag an element in the DOM
 * @param element the element that will move
 * @param headerElement optionally restrict the area that will move element
 */
export function useDragElement<T extends HTMLElement, S extends HTMLElement>({
  element,
  headerElement,
  disabled,
  onDrag,
}: {
  element: RefObject<T | null>;
  headerElement?: RefObject<S | null>;
  disabled?: boolean;
  onDrag?: (e: MouseEvent) => void;
}) {
  useEffect(() => {
    if (disabled) return;
    const elmnt = element?.current as HTMLElement;
    if (!elmnt) return;
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    if (headerElement)
      headerElement?.current?.addEventListener("mousedown", dragMouseDown);
    else elmnt.addEventListener("mousedown", dragMouseDown);

    function dragMouseDown(this: HTMLElement, e: MouseEvent) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.addEventListener("mouseup", closeDragElement);
      document.addEventListener("mousemove", elementDrag);
    }
    function elementDrag(this: Document, e: MouseEvent) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      onDrag?.(e);
    }

    function closeDragElement() {
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);
    }
    return () => {
      if (headerElement)
        headerElement?.current?.removeEventListener("mousedown", dragMouseDown);
      else elmnt.removeEventListener("mousedown", dragMouseDown);
    };
  }, [headerElement, element]);
}

function isVisibleInViewport(
  elem: HTMLElement,
  offSet?: { x?: number; y?: number }
) {
  if (!elem) return { y: false, x: false };

  let y = elem.offsetTop;
  let x = elem.offsetLeft;

  const height = (elem.offsetHeight as number) + (offSet?.y || 0);
  const width = (elem.offsetWidth as number) + (offSet?.x || 0);

  while ((elem = elem.offsetParent as HTMLElement)) {
    y += elem.offsetTop;
    x += elem.offsetLeft;
  }
  const maxHeight = y + height;
  let isVisibleY =
    y > 0 &&
    y < window.pageYOffset + window.innerHeight &&
    maxHeight >= window.pageYOffset &&
    maxHeight < window.innerHeight - window.pageYOffset;

  if (y == undefined) isVisibleY = true;

  /*console.log({
    y,
    pageYoffset: window.pageYOffset,
    innerHeight: window.innerHeight,
    maxHeight,
  });*/

  let isVisibleX = x + width < window.innerWidth && x > 0;

  if (x == undefined) isVisibleX = true;

  return { y: isVisibleY, x: isVisibleX };
}

type visibilityProps = {
  y: boolean;
  x: boolean;
  default_x: boolean;
  default_y: boolean;
};

/** @returns [ref, function triggering check] */
export function useViewPortVisible<T extends HTMLElement>(
  onVisibilityChange: (visible: visibilityProps) => void,
  ref?: RefObject<T>,
  deps?: React.DependencyList
): [RefObject<T | null>, () => void] {
  const [visible, setVisibility] = useState<visibilityProps>();
  const _ref = useMuiRef(ref);
  const current_value = useCallback(() => {
    const node = _ref.current;
    const coord = node?.getBoundingClientRect();
    return {
      offsetParent: node?.offsetParent,
      offsetHeight: coord?.height,
      offsetTop: coord?.top,
      offsetWidth: coord?.width,
      offsetLeft: coord?.left,
    } as T;
  }, [_ref.current]);
  const default_value = useMemo(() => current_value(), [_ref.current]);

  const Handler = useCallback(() => {
    const defVal = isVisibleInViewport(default_value);
    setVisibility({
      ...isVisibleInViewport(current_value()),
      default_x: defVal.x,
      default_y: defVal.y,
    });
  }, [default_value, _ref.current, ref?.current, current_value]);

  useEffect(() => {
    if (!_ref.current || default_value.offsetHeight == undefined) return;
    const defVal = isVisibleInViewport(default_value);
    setVisibility({
      ...isVisibleInViewport(default_value),
      default_x: defVal.x,
      default_y: defVal.y,
    });
  }, [default_value, _ref.current]);

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener("scroll", Handler, { signal: controller.signal });
    window.addEventListener("resize", Handler, { signal: controller.signal });
    return () => {
      controller.abort();
    };
  }, [default_value]);

  useEffect(() => {
    if (visible == undefined) return;
    onVisibilityChange(visible);
  }, [visible, ...(deps || [])]);

  const triggerCheck = useCallback(() => {
    Handler();
  }, [Handler, visible]);

  return [_ref, triggerCheck] as [RefObject<NonNullable<T> | null>, () => void];
}

function getHTMLAndBody() {
  return {
    html: document?.querySelector("html"),
    body: document?.querySelector("body"),
  };
}

/** @returns [prevent, restore] */
export function usePreventScroll(): [Function, Function] {
  const [, setCurrentStyles] = useState<{
    overflow?: string;
    padding?: string;
  }>({
    overflow: undefined,
    padding: undefined,
  });

  const preventScroll = useCallback(() => {
    const { html, body } = getHTMLAndBody();
    if (!html || !body) return;
    html.style.overflowY = "hidden";
    //body.style.paddingRight = "15px";
  }, []);

  const restoreScroll = useCallback(() => {
    const { html, body } = getHTMLAndBody();
    if (!html || !body) return;
    setCurrentStyles((current) => {
      html.style.overflowY = current.overflow || "";
      body.style.paddingRight = current.padding || "";
      return current;
    });
  }, []);

  useEffect(() => {
    const { html, body } = getHTMLAndBody();
    if (!html || !body) return;
    setCurrentStyles({
      overflow: html.style.overflowY,
      padding: body.style.paddingRight,
    });
    return restoreScroll();
  }, []);

  return [preventScroll, restoreScroll];
}

export function MuiSSRPortal({ children }: { children: ReactNode }) {
  const mainRef = useContext(ThemeWrapperRefContext);
  if (typeof document != "undefined" && Boolean(mainRef?.current))
    return createPortal(children, mainRef?.current as Element);
  return <></>;
}

export type FromArray<T> = T extends (infer U)[] ? U : T;
