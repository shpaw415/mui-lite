import type React from "react";
import { Footer, Header, MuiDocsProvider } from "../components";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<MuiDocsProvider>
			<div className="min-h-screen flex flex-col selection:bg-accent/30">
				<Header />
				<main className="flex-1 prose prose-lg mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 prose-pre:bg-transparent prose-pre:p-0">
					{children}
				</main>
				<Footer />
			</div>
		</MuiDocsProvider>
	);
}
