import type { ReactNode } from "react";
import { Footer } from "./Footer";

/**
 * Home (and other non-docs) pages: own scroll region under the fixed header,
 * with footer after the page content.
 */
export function PageContent({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
			<div className="prose prose-lg mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 prose-pre:bg-transparent prose-pre:p-0">
				{children}
			</div>
			<Footer />
		</div>
	);
}

export default PageContent;
