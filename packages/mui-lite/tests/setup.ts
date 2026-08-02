import { GlobalWindow } from "happy-dom";
import { afterEach } from "bun:test";

const happyWindow = new GlobalWindow({
	url: "http://localhost:3000",
	width: 1024,
	height: 768,
});

function install(win: InstanceType<typeof GlobalWindow>) {
	const g = globalThis as any;
	const assign = (key: string, value: unknown) => {
		try {
			Object.defineProperty(g, key, {
				configurable: true,
				writable: true,
				value,
			});
		} catch {
			g[key] = value;
		}
	};

	assign("window", win);
	assign("document", win.document);
	assign("navigator", win.navigator);
	assign("HTMLElement", win.HTMLElement);
	assign("Element", win.Element);
	assign("Node", win.Node);
	assign("DocumentFragment", win.DocumentFragment);
	assign("MutationObserver", win.MutationObserver);
	assign("KeyboardEvent", win.KeyboardEvent);
	assign("MouseEvent", win.MouseEvent);
	assign("Event", win.Event);
	assign("CustomEvent", win.CustomEvent);
	assign(
		"getComputedStyle",
		win.getComputedStyle.bind(win),
	);
	assign(
		"requestAnimationFrame",
		win.requestAnimationFrame?.bind(win) ??
			((cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16)),
	);
	assign(
		"cancelAnimationFrame",
		win.cancelAnimationFrame?.bind(win) ??
			((id: number) => clearTimeout(id)),
	);
	assign("IS_REACT_ACT_ENVIRONMENT", true);

	// Copy remaining browser globals if missing
	for (const key of Object.getOwnPropertyNames(win)) {
		if (key in g) continue;
		try {
			const descriptor = Object.getOwnPropertyDescriptor(win, key);
			if (descriptor) Object.defineProperty(g, key, { ...descriptor, configurable: true });
		} catch {
			/* skip */
		}
	}
}

install(happyWindow);

afterEach(async () => {
	const { cleanup } = await import("@testing-library/react");
	cleanup();
	document.body.innerHTML = "";
});
