"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "../hooks/usePathname";
import { DocsSidebar } from "./DocsSidebar";
import { Footer } from "./Footer";

/**
 * Docs app shell under the site header:
 * ┌ header (root) ─────────────────────────┐
 * │ sidebar │  scroll: article → footer    │
 * └─────────┴──────────────────────────────┘
 * Only the right column scrolls; sidebar stays put.
 */
export function DocsLayoutClient({ children }: { children: ReactNode }) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	useEffect(() => {
		if (!mobileOpen) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [mobileOpen]);

	// Reset content scroll when navigating between docs pages
	useEffect(() => {
		scrollRef.current?.scrollTo({ top: 0 });
	}, [pathname]);

	return (
		<div className="flex min-h-0 flex-1">
			<DocsSidebar
				mobileOpen={mobileOpen}
				onMobileClose={() => setMobileOpen(false)}
			/>

			{/* Single scroll container: docs content then footer */}
			<div
				ref={scrollRef}
				className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain"
			>
				<div className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-2 backdrop-blur-sm lg:hidden">
					<button
						type="button"
						className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-card-hover"
						onClick={() => setMobileOpen(true)}
						aria-expanded={mobileOpen}
						aria-controls="docs-mobile-nav"
					>
						<svg
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
						Menu
					</button>
					<span className="text-sm text-muted">Browse components</span>
				</div>

				<article className="prose prose-lg mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:max-w-4xl lg:px-8 lg:py-12 prose-pre:bg-transparent prose-pre:p-0">
					{children}
				</article>

				<Footer />
			</div>
		</div>
	);
}

export default DocsLayoutClient;
