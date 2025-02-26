import { useEffect, type RefObject } from "react";

export type SwipeOptions = {
  triggerOnTouchEnd?: boolean;
  swipeStatus: (direction: SwipeDirection) => void;
  threshold?: number;
  timeout?: number;
};

type SwipeDirection = "left" | "right" | "bottom" | "top";

export function useSwipe(
  ref: RefObject<HTMLElement | null>,
  {
    triggerOnTouchEnd = true,
    swipeStatus,
    threshold = 200,
    timeout = 500,
  }: SwipeOptions,
  deps: React.DependencyList,
  disabled?: boolean
) {
  useEffect(() => {
    if (disabled) return;
    const getTime = () => new Date().getTime();
    const diff = (t1: number, t2: number) => Math.round(t2 - t1);

    let startTime: number = 0;
    let initialPosition = {
      x: 0,
      y: 0,
    };
    let isTouch = false;
    let touchEndAwaited: SwipeDirection | undefined = undefined;

    const reset = () => {
      startTime = 0;
      initialPosition = {
        x: 0,
        y: 0,
      };
      isTouch = false;
      touchEndAwaited = undefined;
    };

    const touchStartHandler: (ev: TouchEvent) => void = (ev) => {
      startTime = getTime();
      initialPosition = {
        x: ev.touches[0].clientX,
        y: ev.touches[0].clientY,
      };
      isTouch = true;
    };
    const advise = (direction: SwipeDirection) => {
      if (triggerOnTouchEnd) {
        touchEndAwaited = direction;
        return;
      }
      swipeStatus(direction);
      reset();
    };
    const toucheMoveHandler: (ev: TouchEvent) => void = (e) => {
      if (!isTouch || diff(startTime, getTime()) > timeout) return reset();
      else if (e.touches[0].clientX - initialPosition.x > threshold)
        advise("right");
      else if (initialPosition.x - e.touches[0].clientX > threshold)
        advise("left");
      else if (initialPosition.y - e.touches[0].clientY > threshold)
        advise("top");
      else if (e.touches[0].clientY - initialPosition.y > threshold)
        advise("bottom");
    };
    const toucheEndHandler: (ev: TouchEvent) => void = (e) => {
      if (!touchEndAwaited) return;
      swipeStatus(touchEndAwaited);
      reset();
    };

    ref?.current?.addEventListener("touchstart", touchStartHandler);
    ref?.current?.addEventListener("touchmove", toucheMoveHandler);
    ref?.current?.addEventListener("touchend", toucheEndHandler);

    return () => {
      ref?.current?.removeEventListener("touchstart", touchStartHandler);
      ref?.current?.removeEventListener("touchmove", toucheMoveHandler);
      ref?.current?.removeEventListener("touchend", toucheEndHandler);
    };
  }, [ref, disabled, ...deps]);
}
