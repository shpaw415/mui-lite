import type { ReactNode } from "react";

export type CssBaselineProps = {
	children?: ReactNode;
	/** When true, also normalize box-sizing on all elements */
	enableColorScheme?: boolean;
};

/**
 * Global baseline styles for mui-lite apps.
 * Prefer importing `@shpaw415/mui-lite/style.css` once at the app root;
 * this component injects a minimal complementary reset.
 */
/**
 * Global reset and theme background for consistent baselines.
 *
 * @example App root
 * ```tsx
 * <>
 *   <CssBaseline />
 *   <App />
 * </>
 * ```
 */
export default function CssBaseline({
	children,
	enableColorScheme = false,
}: CssBaselineProps) {
	return (
		<>
			<style type="text/css">{`
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  ${enableColorScheme ? "color-scheme: light dark;" : ""}
}
*, *::before, *::after {
  box-sizing: inherit;
}
body {
  margin: 0;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.00938em;
}
strong, b {
  font-weight: 700;
}
`}</style>
			{children}
		</>
	);
}
