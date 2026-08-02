"use client";

import {
	DefaultTheme,
	type MuiTheme,
	ThemeProvider as MuiThemeProvider,
} from "@shpaw415/mui-lite/theme";
import { type ReactNode, useMemo } from "react";
import { ThemeProvider, useTheme } from "./ThemeProvider";

function MuiThemeBridge({ children }: { children: ReactNode }) {
	const { theme } = useTheme();
	const muiTheme = useMemo<MuiTheme>(
		() => ({
			...DefaultTheme,
			theme,
		}),
		[theme],
	);
	return (
		<MuiThemeProvider
			theme={muiTheme}
			WrapperElement="div"
			className="mui-docs-root"
		>
			{children}
		</MuiThemeProvider>
	);
}

export function MuiDocsProvider({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<MuiThemeBridge>{children}</MuiThemeBridge>
		</ThemeProvider>
	);
}
