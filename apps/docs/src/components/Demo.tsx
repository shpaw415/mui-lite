"use client";

import { type ReactNode, useEffect, useState } from "react";

export function Demo({
	children,
	title,
	code,
	lang = "tsx",
}: {
	children: ReactNode;
	title?: string;
	code?: string;
	lang?: string;
}) {
	const [html, setHtml] = useState<string>("");

	useEffect(() => {
		if (!code) {
			setHtml("");
			return;
		}
		let cancelled = false;
		import("shiki")
			.then(({ codeToHtml }) =>
				codeToHtml(code.trimEnd(), {
					lang,
					themes: {
						light: "github-light",
						dark: "one-dark-pro",
					},
					defaultColor: false,
				}),
			)
			.then((out) => {
				if (!cancelled) setHtml(out);
			})
			.catch(() => {
				if (!cancelled) setHtml("");
			});
		return () => {
			cancelled = true;
		};
	}, [code, lang]);

	return (
		<div className="not-prose my-6 overflow-hidden rounded-xl border border-border bg-card">
			{title && (
				<div className="border-b border-border px-4 py-2 text-sm font-medium text-muted">
					{title}
				</div>
			)}
			<div className="flex w-full flex-wrap items-center gap-3 p-6">{children}</div>
			{code && (
				<div className="demo-code-block border-t border-border text-left text-xs">
					{html ? (
						<div
							// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output
							dangerouslySetInnerHTML={{ __html: html }}
						/>
					) : (
						<pre className="overflow-x-auto bg-[#161b22] p-4 leading-relaxed text-[#c9d1d9]">
							<code className="font-mono whitespace-pre">{code}</code>
						</pre>
					)}
				</div>
			)}
		</div>
	);
}
