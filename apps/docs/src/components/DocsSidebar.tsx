"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { docsComponentGroups, docsGuideLinks } from "../docs-nav";
import { usePathname } from "../hooks/usePathname";

function normalizePath(path: string) {
	return path.replace(/\/$/, "") || "/";
}

function isActive(pathname: string, href: string) {
	const p = normalizePath(pathname);
	const h = normalizePath(href);
	return p === h;
}

export type DocsSidebarProps = {
	/** Optional SSR path if available later */
	pathname?: string;
	/** Mobile drawer open controlled by parent */
	mobileOpen?: boolean;
	onMobileClose?: () => void;
};

export function DocsSidebar({
	pathname: pathnameProp,
	mobileOpen = false,
	onMobileClose,
}: DocsSidebarProps) {
	const pathname = usePathname(pathnameProp);
	const [query, setQuery] = useState("");
	const navRef = useRef<HTMLElement>(null);
	const activeRef = useRef<HTMLAnchorElement | null>(null);

	const q = query.trim().toLowerCase();

	const filteredGroups = useMemo(() => {
		if (!q) return docsComponentGroups;
		return docsComponentGroups
			.map((group) => ({
				...group,
				items: group.items.filter(
					(item) =>
						item.label.toLowerCase().includes(q) ||
						item.href.toLowerCase().includes(q),
				),
			}))
			.filter((g) => g.items.length > 0);
	}, [q]);

	const filteredGuides = useMemo(() => {
		if (!q) return docsGuideLinks;
		return docsGuideLinks.filter(
			(item) =>
				item.label.toLowerCase().includes(q) ||
				item.href.toLowerCase().includes(q),
		);
	}, [q]);

	// Scroll active link into view on mount / path change
	useEffect(() => {
		activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
	}, [pathname]);

	const renderNav = (idPrefix: string) => (
		<nav
			ref={idPrefix === "desktop" ? navRef : undefined}
			className="flex h-full min-h-0 flex-col"
			aria-label="Documentation"
		>
			<div className="shrink-0 border-b border-border bg-background px-3 pb-3 pt-3">
				<label className="sr-only" htmlFor={`${idPrefix}-docs-nav-search`}>
					Search components
				</label>
				<input
					id={`${idPrefix}-docs-nav-search`}
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search components…"
					className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent"
				/>
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
				{filteredGuides.length > 0 && (
					<div className="mb-6">
						<p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted">
							Guide
						</p>
						<ul className="space-y-0.5">
							{filteredGuides.map((item) => {
								const active = isActive(pathname, item.href);
								return (
									<li key={item.href}>
										<a
											ref={active ? activeRef : undefined}
											href={item.href}
											aria-current={active ? "page" : undefined}
											onClick={onMobileClose}
											className={
												active
													? "block rounded-md bg-accent/15 px-2 py-1.5 text-sm font-medium text-accent"
													: "block rounded-md px-2 py-1.5 text-sm text-muted transition-colors hover:bg-card hover:text-foreground"
											}
										>
											{item.label}
										</a>
									</li>
								);
							})}
						</ul>
					</div>
				)}

				{filteredGroups.map((group) => (
					<div key={group.title} className="mb-6 last:mb-0">
						<p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted">
							{group.title}
						</p>
						<ul className="space-y-0.5">
							{group.items.map((item) => {
								const active = isActive(pathname, item.href);
								return (
									<li key={item.href}>
										<a
											ref={active ? activeRef : undefined}
											href={item.href}
											aria-current={active ? "page" : undefined}
											onClick={onMobileClose}
											className={
												active
													? "block rounded-md bg-accent/15 px-2 py-1.5 text-sm font-medium text-accent"
													: "block rounded-md px-2 py-1.5 text-sm text-muted transition-colors hover:bg-card hover:text-foreground"
											}
										>
											{item.label}
										</a>
									</li>
								);
							})}
						</ul>
					</div>
				))}

				{filteredGuides.length === 0 && filteredGroups.length === 0 && (
					<p className="px-2 text-sm text-muted">No matches for “{query}”.</p>
				)}
			</div>
		</nav>
	);

	return (
		<>
			{/*
			 * Desktop sidebar: static flex sibling of the scroll pane.
			 * Fills the shell height under the header — no fixed/sticky hacks.
			 */}
			<aside
				className="hidden h-full w-64 shrink-0 flex-col border-r border-border bg-background lg:flex"
				aria-label="Documentation sidebar"
			>
				{renderNav("desktop")}
			</aside>

			{/* Mobile drawer */}
			{mobileOpen && (
				<div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal>
					<button
						type="button"
						className="absolute inset-0 bg-black/40"
						aria-label="Close navigation"
						onClick={onMobileClose}
					/>
					<aside className="absolute inset-y-0 left-0 flex w-[min(100%,18rem)] flex-col border-r border-border bg-background shadow-xl">
						<div className="flex h-14 items-center justify-between border-b border-border px-3">
							<span className="text-sm font-semibold text-foreground">
								Components
							</span>
							<button
								type="button"
								className="rounded-md p-2 text-muted hover:bg-card hover:text-foreground"
								aria-label="Close"
								onClick={onMobileClose}
							>
								<svg
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						<div className="min-h-0 flex-1 overflow-hidden">
							{renderNav("mobile")}
						</div>
					</aside>
				</div>
			)}
		</>
	);
}

export default DocsSidebar;
