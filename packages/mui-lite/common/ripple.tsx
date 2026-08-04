"use client";

import clsx from "clsx";
import React, {
	createContext,
	type RefObject,
	useCallback,
	useContext,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { type SxProps, useClassNames, useStyle } from "./theme";
import { type MuiElementColors, useColorOverRide } from "./utils";

const RIPPLE_MS = 550;

export type RippleOffset = {
	top?: number;
	left?: number;
};

type RippleItem = {
	id: string;
	/** Top-left of the circle in the ripple-root's local coordinate space */
	x: number;
	y: number;
	/** Diameter in local px */
	size: number;
};

/**
 * Map a viewport click into the local coordinate space of `container` and
 * compute a circle large enough to cover every corner from that origin.
 *
 * Handles:
 * - border-box vs padding-box (container is expected to be borderless)
 * - CSS scale transforms via offsetWidth/offsetHeight vs getBoundingClientRect
 * - center origin (keyboard / centerRipple)
 */
export function computeRippleGeometry(
	container: HTMLElement,
	clientX: number,
	clientY: number,
	options?: {
		center?: boolean;
		offset?: RippleOffset;
	},
): { x: number; y: number; size: number } {
	const rect = container.getBoundingClientRect();
	const ow = container.offsetWidth;
	const oh = container.offsetHeight;

	// Avoid division by zero for unlaid-out nodes
	const scaleX = ow > 0 && rect.width > 0 ? rect.width / ow : 1;
	const scaleY = oh > 0 && rect.height > 0 ? rect.height / oh : 1;

	let localX: number;
	let localY: number;

	if (options?.center) {
		localX = ow / 2;
		localY = oh / 2;
	} else {
		// Viewport → local (unscaled) coordinates
		localX = (clientX - rect.left) / scaleX;
		localY = (clientY - rect.top) / scaleY;
	}

	localX += options?.offset?.left ?? 0;
	localY += options?.offset?.top ?? 0;

	// Diameter = 2 × distance to the furthest corner so the circle covers the host
	const sizeX = Math.max(localX, ow - localX);
	const sizeY = Math.max(localY, oh - localY);
	const size = Math.sqrt(sizeX * sizeX + sizeY * sizeY) * 2;

	// Position the circle so its center is at the press point
	return {
		x: localX - size / 2,
		y: localY - size / 2,
		size,
	};
}

interface RippleEffectProps {
	children: React.ReactNode;
	className?: string;
	onClick?: (event: React.MouseEvent) => void;
	/** @deprecated Prefer fixing host layout; kept for rare fine-tuning */
	offset?: RippleOffset;
	disabled?: boolean;
	elRef?: RefObject<any>;
	sx?: SxProps;
	center?: boolean;
	/** Palette ink color; omit to inherit the host's CSS `color`. */
	color?: MuiElementColors;
	colorOverRide?: React.CSSProperties["color"];
}

const RippleContext = createContext<RefObject<HTMLDivElement | null>>(
	{} as any,
);

/**
 * Wrapper that provides its own positioned surface for ink.
 * Prefer {@link RippleBase} when the host element already exists.
 */
const RippleEffect: React.FC<RippleEffectProps> = ({
	children,
	className = "",
	onClick,
	offset,
	disabled,
	elRef,
	sx,
	center,
	color,
	colorOverRide,
}) => {
	const [ripples, setRipples] = useState<RippleItem[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const surfaceRef = useRef<HTMLSpanElement>(null);
	const style = useStyle(sx);
	const idBase = useId();
	const seq = useRef(0);
	const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
	const overRide = useColorOverRide({ colorOverRide });
	const colorClass = useClassNames({
		component_name: "Ripple",
		state: color ? [color] : [],
	});

	const clearTimer = (id: string) => {
		const t = timers.current.get(id);
		if (t) {
			clearTimeout(t);
			timers.current.delete(id);
		}
	};

	const spawn = useCallback(
		(clientX: number, clientY: number, centered?: boolean) => {
			if (disabled) return;
			const surface = surfaceRef.current ?? containerRef.current;
			if (!surface) return;

			const { x, y, size } = computeRippleGeometry(surface, clientX, clientY, {
				center: centered ?? center,
				offset,
			});
			const id = `${idBase}-${seq.current++}`;
			setRipples((prev) => [...prev, { id, x, y, size }]);

			clearTimer(id);
			timers.current.set(
				id,
				setTimeout(() => {
					setRipples((prev) => prev.filter((r) => r.id !== id));
					timers.current.delete(id);
				}, RIPPLE_MS),
			);
		},
		[disabled, center, offset, idBase],
	);

	useEffect(() => {
		return () => {
			for (const t of timers.current.values()) clearTimeout(t);
			timers.current.clear();
		};
	}, []);

	const handlePointerDown = useCallback(
		(e: React.PointerEvent) => {
			if (disabled) return;
			if (e.pointerType === "mouse" && e.button !== 0) return;
			spawn(e.clientX, e.clientY, false);
		},
		[disabled, spawn],
	);

	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			if (disabled) return;
			onClick?.(e);
			// Keyboard activation: detail === 0
			if (e.detail === 0) {
				const surface = surfaceRef.current ?? containerRef.current;
				if (!surface) return;
				const rect = surface.getBoundingClientRect();
				spawn(rect.left + rect.width / 2, rect.top + rect.height / 2, true);
			}
		},
		[disabled, onClick, spawn],
	);

	return (
		<div
			ref={containerRef}
			className={clsx("MUI_RippleEffect", className, style.classNameFromSx)}
			style={style.styleFromSx}
			onPointerDown={handlePointerDown}
			onClick={handleClick}
		>
			<RippleContext value={containerRef}>{children}</RippleContext>
			<span
				className={clsx("MUI_Ripple_root", color && colorClass.combined)}
				ref={surfaceRef}
				style={overRide as React.CSSProperties | undefined}
				aria-hidden
			>
				{ripples.map((ripple) => (
					<span
						key={ripple.id}
						onClick={() => elRef?.current?.click?.()}
						className="MUI_Ripple_span"
						style={{
							left: ripple.x,
							top: ripple.y,
							width: ripple.size,
							height: ripple.size,
						}}
					/>
				))}
			</span>
		</div>
	);
};

export type RippleBaseProps = {
	disabled?: boolean;
	/**
	 * Optional fine-tune in local px. Prefer not using this — geometry is
	 * measured against an absolute-fill layer that matches the host.
	 */
	offset?: RippleOffset;
	/** Host element that receives pointer/keyboard interaction */
	ref: RefObject<HTMLElement | null>;
	/** Optional secondary element to click on keyboard activation */
	clickRef?: RefObject<HTMLElement | null>;
	sx?: SxProps;
	className?: string;
	/**
	 * Palette ink color (`primary`, `secondary`, …).
	 * Omit to inherit the host's CSS `color` (correct for contained buttons
	 * where ink should stay white / contrast text).
	 */
	color?: MuiElementColors;
	/** Force ink to a raw CSS color (wins over `color`). */
	colorOverRide?: React.CSSProperties["color"];
	/** When true, do not re-dispatch click on the host (avoids recursion). */
	preventClickElement?: boolean;
	onRippleClick?: () => void;
	/** Always originate the ink from the host center (e.g. keyboard / centerRipple). */
	center?: boolean;
};

/**
 * Material-style ink layer for an existing pressable host.
 *
 * Renders an absolute-fill surface (`MUI_Ripple_root`) inside the host and
 * measures press coordinates against that surface — not against a possibly
 * mismatched event target (e.g. a nested input). The host must be a
 * positioned box (`position: relative | absolute | fixed`).
 */
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
	onRippleClick,
	center = false,
}: RippleBaseProps) {
	const [ripples, setRipples] = useState<RippleItem[]>([]);
	const surfaceRef = useRef<HTMLSpanElement>(null);
	const idBase = useId();
	const seq = useRef(0);
	const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

	// Keep latest props in refs so listeners stay stable
	const disabledRef = useRef(disabled);
	disabledRef.current = disabled;
	const offsetRef = useRef(offset);
	offsetRef.current = offset;
	const centerRef = useRef(center);
	centerRef.current = center;
	const onRippleClickRef = useRef(onRippleClick);
	onRippleClickRef.current = onRippleClick;
	const preventClickRef = useRef(preventClickElement);
	preventClickRef.current = preventClickElement;
	const clickRefRef = useRef(clickRef);
	clickRefRef.current = clickRef;

	const isHostDisabled = useCallback(() => {
		if (disabledRef.current) return true;
		const el = ref.current;
		if (!el) return false;
		if (
			"disabled" in el &&
			Boolean((el as HTMLButtonElement | HTMLInputElement).disabled)
		) {
			return true;
		}
		if (el.getAttribute("aria-disabled") === "true") return true;
		if (el.hasAttribute("disabled")) return true;
		if (
			el.classList.contains("_disabled") ||
			el.className.split(/\s+/).some((c) => c.endsWith("_disabled"))
		) {
			return true;
		}
		return false;
	}, [ref]);

	const spawnRipple = useCallback(
		(clientX: number, clientY: number, centered: boolean) => {
			if (isHostDisabled()) return;
			const surface = surfaceRef.current;
			if (!surface) return;

			const { x, y, size } = computeRippleGeometry(surface, clientX, clientY, {
				center: centered,
				offset: offsetRef.current,
			});
			const id = `${idBase}-${seq.current++}`;
			setRipples((prev) => [...prev, { id, x, y, size }]);

			const existing = timers.current.get(id);
			if (existing) clearTimeout(existing);
			timers.current.set(
				id,
				setTimeout(() => {
					setRipples((prev) => prev.filter((r) => r.id !== id));
					timers.current.delete(id);
				}, RIPPLE_MS),
			);
		},
		[idBase, isHostDisabled],
	);

	const handlePointerDown = useCallback(
		(e: PointerEvent) => {
			if (isHostDisabled()) return;
			if (e.pointerType === "mouse" && e.button !== 0) return;
			// Ignore events that didn't land inside the host (e.g. retargeted)
			const host = ref.current;
			if (!host) return;
			// center prop forces center origin even for pointer
			spawnRipple(e.clientX, e.clientY, centerRef.current);
			onRippleClickRef.current?.();
		},
		[ref, spawnRipple, isHostDisabled],
	);

	const handleClick = useCallback(
		(e: MouseEvent) => {
			if (isHostDisabled()) return;
			// Prefer pointerdown for real pointer input; detail === 0 ≈ keyboard
			if (e.detail !== 0) return;
			const surface = surfaceRef.current ?? ref.current;
			if (!surface) return;
			const rect = surface.getBoundingClientRect();
			spawnRipple(
				rect.left + rect.width / 2,
				rect.top + rect.height / 2,
				true,
			);
			if (!preventClickRef.current) {
				// host already received the click
			}
			clickRefRef.current?.current?.click();
			onRippleClickRef.current?.();
		},
		[ref, spawnRipple, isHostDisabled],
	);

	// Ensure the host is a positioning context so the absolute-fill layer
	// matches the host box. Only set if still static.
	useLayoutEffect(() => {
		const host = ref.current;
		if (!host) return;
		const pos = getComputedStyle(host).position;
		if (pos === "static") {
			host.style.position = "relative";
		}
	}, [ref]);

	useEffect(() => {
		let el = ref.current;
		let attached = false;

		const attach = () => {
			el = ref.current;
			if (!el || attached) return;
			// Capture phase so we see the press even if a child stops bubbling
			el.addEventListener("pointerdown", handlePointerDown);
			el.addEventListener("click", handleClick);
			attached = true;
		};

		attach();
		const raf = requestAnimationFrame(attach);

		return () => {
			cancelAnimationFrame(raf);
			if (el) {
				el.removeEventListener("pointerdown", handlePointerDown);
				el.removeEventListener("click", handleClick);
			}
		};
	}, [ref, handlePointerDown, handleClick]);

	useEffect(() => {
		return () => {
			for (const t of timers.current.values()) clearTimeout(t);
			timers.current.clear();
		};
	}, []);

	const style = useStyle(sx);
	// Color classes live on the root so ink (currentColor) tracks component color
	const rippleClass = useClassNames({
		component_name: "Ripple",
		state: color ? [color] : [],
		className,
	});
	const overRide = useColorOverRide({ colorOverRide });

	return (
		<span
			className={clsx("MUI_Ripple_root", (color || className) && rippleClass.combined)}
			ref={surfaceRef}
			style={
				{
					...overRide,
					...style.styleFromSx,
				} as React.CSSProperties
			}
			aria-hidden
		>
			{ripples.map((ripple) => (
				<span
					key={ripple.id}
					className={clsx("MUI_Ripple_span", style.classNameFromSx)}
					style={{
						left: ripple.x,
						top: ripple.y,
						width: ripple.size,
						height: ripple.size,
					}}
				/>
			))}
		</span>
	);
}

function useRipple() {
	const context = useContext(RippleContext);
	return () => context.current?.click();
}

export default RippleEffect;
export { RippleBase, useRipple };
