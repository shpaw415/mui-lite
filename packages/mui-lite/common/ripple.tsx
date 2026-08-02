"use client";

import clsx from "clsx";
import React, {
	createContext,
	type RefObject,
	useCallback,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { type SxProps, useClassNames, useStyle } from "./theme";
import { type MuiElementColors, useColorOverRide } from "./utils";

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

type RippleItem = {
	id: string;
	x: number;
	y: number;
	size: number;
};

const RippleContext = createContext<RefObject<HTMLDivElement | null>>(
	{} as any,
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
	const [ripples, setRipples] = useState<RippleItem[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const style = useStyle(sx);
	const idBase = useId();
	const seq = useRef(0);

	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			if (disabled) return;
			onClick?.(e);

			const container = containerRef.current;
			if (!container) return;

			const { left, top, width, height } = container.getBoundingClientRect();
			const size = Math.max(width, height) * 2;
			const x = e.clientX - left - size / 2 + (offset?.left || 0);
			const y = e.clientY - top - size / 2 + (offset?.top || 0);
			const id = `${idBase}-${seq.current++}`;

			setRipples((prev) => [...prev, { id, x, y, size }]);
		},
		[disabled, onClick, offset, idBase],
	);

	useEffect(() => {
		if (ripples.length === 0) return;
		const timeout = setTimeout(() => {
			setRipples((prev) => prev.slice(1));
		}, 550);
		return () => clearTimeout(timeout);
	}, [ripples]);

	return (
		<div
			ref={containerRef}
			className={clsx("MUI_RippleEffect", className, style.classNameFromSx)}
			style={style.styleFromSx}
			onClick={handleClick}
		>
			<RippleContext value={containerRef}>{children}</RippleContext>
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
		</div>
	);
};

/**
 * Renders Material-style ink ripples into a parent element (via `ref`).
 * Attach the same `ref` to the pressable host (button, etc.).
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
	/** When true, do not re-dispatch click on the host (avoids recursion). */
	preventClickElement?: boolean;
	onRippleClick?: () => void;
}) {
	const [ripples, setRipples] = useState<RippleItem[]>([]);
	const idBase = useId();
	const seq = useRef(0);
	const disabledRef = useRef(disabled);
	disabledRef.current = disabled;

	/** Prop disabled OR native/ARIA disabled on the host element */
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
		// Common MUI-lite state class from useClassNames
		if (
			el.classList.contains("_disabled") ||
			el.className.split(/\s+/).some((c) => c.endsWith("_disabled"))
		) {
			return true;
		}
		return false;
	}, [ref]);

	const spawnRipple = useCallback(
		(clientX: number, clientY: number) => {
			if (isHostDisabled()) return;
			const container = ref.current;
			if (!container) return;

			const { left, top, width, height } = container.getBoundingClientRect();
			// Diameter large enough to cover the host from the click point
			const size = Math.max(width, height) * 2;
			const x = clientX - left - size / 2 + (offset?.left || 0);
			const y = clientY - top - size / 2 + (offset?.top || 0);
			const id = `${idBase}-${seq.current++}`;

			setRipples((prev) => [...prev, { id, x, y, size }]);
		},
		[ref, offset, idBase, isHostDisabled],
	);

	const handlePointerDown = useCallback(
		(e: PointerEvent) => {
			if (isHostDisabled()) return;
			// Primary button / touch / pen only
			if (e.pointerType === "mouse" && e.button !== 0) return;
			spawnRipple(e.clientX, e.clientY);
			onRippleClick?.();
		},
		[spawnRipple, onRippleClick, isHostDisabled],
	);

	// Also support keyboard activation (Space/Enter synthesizes click)
	const handleClick = useCallback(
		(e: MouseEvent) => {
			if (isHostDisabled()) return;
			// Prefer pointerdown for pointer input; only use click for keyboard
			// (detail === 0 is typical for non-pointer synthetic clicks)
			if (e.detail !== 0) return;
			const container = ref.current;
			if (!container) return;
			const { left, top, width, height } = container.getBoundingClientRect();
			spawnRipple(left + width / 2, top + height / 2);
			if (!preventClickElement) {
				// no-op: host already received the click
			}
			clickRef?.current?.click();
			onRippleClick?.();
		},
		[ref, spawnRipple, preventClickElement, clickRef, onRippleClick, isHostDisabled],
	);

	useEffect(() => {
		// Re-check each effect cycle: parent may assign ref after first paint
		let el = ref.current;
		let attached = false;

		const attach = () => {
			el = ref.current;
			if (!el || attached) return;
			el.addEventListener("pointerdown", handlePointerDown);
			el.addEventListener("click", handleClick);
			attached = true;
		};

		attach();
		// If ref not ready yet (edge cases), try again after paint
		const raf = requestAnimationFrame(attach);

		return () => {
			cancelAnimationFrame(raf);
			if (el) {
				el.removeEventListener("pointerdown", handlePointerDown);
				el.removeEventListener("click", handleClick);
			}
		};
	}, [ref, handlePointerDown, handleClick]);

	// Drop finished ripples
	useEffect(() => {
		if (ripples.length === 0) return;
		const timeout = setTimeout(() => {
			setRipples((prev) => prev.slice(1));
		}, 550);
		return () => clearTimeout(timeout);
	}, [ripples]);

	const style = useStyle(sx);

	const rippleClass = useClassNames({
		component_name: "Ripple",
		state: [color],
		className,
	});

	const overRide = useColorOverRide({ colorOverRide });

	if (ripples.length === 0) return null;

	return (
		<>
			{ripples.map((ripple) => (
				<span
					key={ripple.id}
					className={clsx(
						"MUI_Ripple_span",
						rippleClass.combined,
						style.classNameFromSx,
					)}
					style={{
						left: ripple.x,
						top: ripple.y,
						width: ripple.size,
						height: ripple.size,
						...overRide,
						...style.styleFromSx,
					}}
					aria-hidden
				/>
			))}
		</>
	);
}

function useRipple() {
	const context = useContext(RippleContext);
	return () => context.current?.click();
}

export default RippleEffect;
export { RippleBase, useRipple };
