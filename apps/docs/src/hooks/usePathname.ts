"use client";

import { useEffect, useState } from "react";

function readPathname() {
	if (typeof window === "undefined") return "";
	return window.location.pathname.replace(/\/$/, "") || "/";
}

/**
 * Current path for SPA-aware active nav.
 * Frame Master uses history.pushState without popstate — we patch pushState/replaceState.
 */
export function usePathname(serverPath = ""): string {
	const [pathname, setPathname] = useState(serverPath || readPathname);

	useEffect(() => {
		const sync = () => setPathname(readPathname());

		sync();
		window.addEventListener("popstate", sync);

		const { pushState, replaceState } = window.history;
		window.history.pushState = function (...args) {
			pushState.apply(this, args);
			sync();
		};
		window.history.replaceState = function (...args) {
			replaceState.apply(this, args);
			sync();
		};

		return () => {
			window.removeEventListener("popstate", sync);
			window.history.pushState = pushState;
			window.history.replaceState = replaceState;
		};
	}, []);

	return pathname || serverPath || "/";
}
