import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import {
	DefaultTheme,
	ThemeProvider,
	type MuiTheme,
} from "../../common/theme";

export function renderWithTheme(
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper"> & { theme?: MuiTheme },
) {
	const theme = options?.theme ?? {
		...DefaultTheme,
		theme: "light" as const,
	};
	const Wrapper = ({ children }: { children: ReactNode }) => (
		<ThemeProvider theme={theme} WrapperElement="div">
			{children}
		</ThemeProvider>
	);
	return render(ui, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";
