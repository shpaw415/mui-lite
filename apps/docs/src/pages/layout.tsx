import type React from "react";
import { Header, MuiDocsProvider } from "../components";

/**
 * App shell: fixed viewport height, header always visible.
 * Each route owns its own scroll region (home page or docs pane).
 */
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<MuiDocsProvider>
			<div className="flex h-dvh flex-col overflow-hidden selection:bg-accent/30">
				<Header />
				<main className="flex min-h-0 flex-1 flex-col overflow-hidden">
					{children}
				</main>
			</div>
		</MuiDocsProvider>
	);
}
