/**
 * Site Configuration — mui-lite docs
 */
export const siteConfig = {
	name: "mui-lite",
	description:
		"Lightweight Material Design components for React 19 — CSS variables, sx prop, deep imports.",
	url: "https://mui-lite.pages.dev",
	author: {
		name: "shpaw415",
		url: "https://github.com/shpaw415",
		email: "",
	},
	links: {
		github: "https://github.com/shpaw415/mui-lite",
		twitter: "",
		discord: "",
	},
	nav: [
		{ label: "Home", href: "/" },
		{ label: "Docs", href: "/docs/getting-started" },
		{ label: "Components", href: "/docs/components" },
		{ label: "Theming", href: "/docs/theming" },
	],
	footer: {
		sections: [
			{
				title: "Documentation",
				links: [
					{ label: "Getting Started", href: "/docs/getting-started" },
					{ label: "Theming", href: "/docs/theming" },
					{ label: "sx prop", href: "/docs/sx" },
					{ label: "Components", href: "/docs/components" },
				],
			},
			{
				title: "Community",
				links: [
					{
						label: "GitHub",
						href: "https://github.com/shpaw415/mui-lite",
					},
					{
						label: "Frame Master",
						href: "https://frame-master.com/docs",
					},
				],
			},
		],
		copyright: `© ${new Date().getFullYear()} mui-lite. All rights reserved.`,
	},
	theme: {
		defaultTheme: "system" as "light" | "dark" | "system",
		accentColor: "#1976d2",
		dark: {
			background: "#0a0a0a",
			foreground: "#fafafa",
			muted: "#a1a1aa",
			border: "#27272a",
			card: "#18181b",
			cardHover: "#27272a",
		},
		light: {
			background: "#ffffff",
			foreground: "#0a0a0a",
			muted: "#71717a",
			border: "#e4e4e7",
			card: "#f4f4f5",
			cardHover: "#e4e4e7",
		},
	},
	seo: {
		titleTemplate: "%s | mui-lite",
		defaultTitle: "mui-lite",
		openGraph: {
			type: "website",
			locale: "en_US",
			siteName: "mui-lite",
		},
	},
} as const;

export type SiteConfig = typeof siteConfig;
export type NavItem = (typeof siteConfig.nav)[number];
export type FooterSection = (typeof siteConfig.footer.sections)[number];
export type ThemeMode = "light" | "dark" | "system";
