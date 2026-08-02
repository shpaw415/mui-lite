import { siteConfig } from "./site.config";

// Script to prevent flash of wrong theme
const themeScript = `
(function() {
  const stored = localStorage.getItem('theme-mode');
  const defaultTheme = '${siteConfig.theme.defaultTheme}';
  const mode = stored || defaultTheme;
  let theme = mode;
  if (mode === 'system') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.classList.add(theme);
})();
`;

export default function RenderShell({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="description" content={siteConfig.description} />
				<meta name="author" content={siteConfig.author.name} />
				<meta name="color-scheme" content="light dark" />

				{/* Open Graph / Social */}
				<meta property="og:type" content={siteConfig.seo.openGraph.type} />
				<meta
					property="og:site_name"
					content={siteConfig.seo.openGraph.siteName}
				/>
				<meta property="og:title" content={siteConfig.seo.defaultTitle} />
				<meta property="og:description" content={siteConfig.description} />
				<meta property="og:locale" content={siteConfig.seo.openGraph.locale} />

				{/* Favicon - Add your favicon files to the static folder */}
				<link rel="icon" href="/static/favicon.svg" type="image/svg+xml" />

				<link rel="stylesheet" href="/static/style.css" />
				<title>{siteConfig.seo.defaultTitle}</title>

				{/* Theme initialization script - prevents flash */}
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body
				id="root"
				className="bg-background text-foreground antialiased transition-colors"
			>
				{children}
			</body>
		</html>
	);
}
