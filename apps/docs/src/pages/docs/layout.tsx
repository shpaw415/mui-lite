import type React from "react";
import { DocsLayoutClient } from "../../components/DocsLayoutClient";

/**
 * Nested layout for all /docs/* routes — side menu + content.
 */
export default function DocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
