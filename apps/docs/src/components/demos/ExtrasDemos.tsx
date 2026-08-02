"use client";

import { useState } from "react";
import Button from "@shpaw415/mui-lite/Button";
import ClickAwayListener from "@shpaw415/mui-lite/ClickAwayListener";
import FormControl from "@shpaw415/mui-lite/FormControl";
import FormGroup from "@shpaw415/mui-lite/FormGroup";
import FormHelperText from "@shpaw415/mui-lite/FormHelperText";
import FormLabel from "@shpaw415/mui-lite/FormLabel";
import FormControlLabel from "@shpaw415/mui-lite/FormControlLabel";
import Input, {
	FilledInput,
	OutlinedInput,
} from "@shpaw415/mui-lite/Input";
import InputAdornment from "@shpaw415/mui-lite/InputAdornment";
import InputBase from "@shpaw415/mui-lite/InputBase";
import InputLabel from "@shpaw415/mui-lite/InputLabel";
import Paper from "@shpaw415/mui-lite/Paper";
import { TablePagination } from "@shpaw415/mui-lite/Pagination";
import CheckBox from "@shpaw415/mui-lite/CheckBox";
import Stack from "@shpaw415/mui-lite/Stack";
import Typography from "@shpaw415/mui-lite/Typography";
import { Demo } from "../Demo";

export function InputBaseDemo() {
	return (
		<Demo>
			<div style={{ width: "100%", maxWidth: 280 }}>
				<InputBase placeholder="Bare input" style={{ width: "100%" }} />
			</div>
		</Demo>
	);
}

export function InputVariantsDemo() {
	return (
		<Demo>
			<Stack spacing={2} style={{ width: "100%", maxWidth: 280 }}>
				<FormControl variant="standard" fullWidth>
					<InputLabel>Standard</InputLabel>
					<Input defaultValue="hello" />
				</FormControl>
				<FormControl variant="outlined" fullWidth>
					<InputLabel>Outlined</InputLabel>
					<OutlinedInput
						startAdornment={
							<InputAdornment position="start">$</InputAdornment>
						}
					/>
				</FormControl>
				<FormControl variant="filled" fullWidth>
					<InputLabel>Filled</InputLabel>
					<FilledInput
						endAdornment={<InputAdornment position="end">kg</InputAdornment>}
					/>
				</FormControl>
			</Stack>
		</Demo>
	);
}

export function InputLabelDemo() {
	return (
		<Demo>
			<FormControl variant="outlined" style={{ minWidth: 220 }}>
				<InputLabel>Email address</InputLabel>
				<OutlinedInput type="email" />
			</FormControl>
		</Demo>
	);
}

export function InputAdornmentDemo() {
	return (
		<Demo>
			<Stack spacing={2} style={{ width: "100%", maxWidth: 280 }}>
				<FormControl variant="outlined" fullWidth>
					<InputLabel>Amount</InputLabel>
					<OutlinedInput
						startAdornment={
							<InputAdornment position="start">$</InputAdornment>
						}
					/>
				</FormControl>
				<FormControl variant="outlined" fullWidth>
					<InputLabel>Weight</InputLabel>
					<OutlinedInput
						endAdornment={<InputAdornment position="end">kg</InputAdornment>}
					/>
				</FormControl>
			</Stack>
		</Demo>
	);
}

export function FormLabelDemo() {
	return (
		<Demo>
			<Stack spacing={1}>
				<FormLabel>Plain label</FormLabel>
				<FormLabel required>Required field</FormLabel>
				<FormLabel error>Error state</FormLabel>
				<FormLabel disabled>Disabled</FormLabel>
			</Stack>
		</Demo>
	);
}

export function FormHelperTextDemo() {
	return (
		<Demo>
			<FormControl variant="outlined" error style={{ minWidth: 240 }}>
				<InputLabel>Username</InputLabel>
				<OutlinedInput defaultValue="ab" />
				<FormHelperText>Must be at least 3 characters.</FormHelperText>
			</FormControl>
		</Demo>
	);
}

export function FormGroupDemo() {
	return (
		<Demo>
			<Stack spacing={2}>
				<FormGroup>
					<FormControlLabel control={<CheckBox defaultChecked />} label="Email" />
					<FormControlLabel control={<CheckBox />} label="SMS" />
				</FormGroup>
				<FormGroup row>
					<FormControlLabel control={<CheckBox defaultChecked />} label="A" />
					<FormControlLabel control={<CheckBox />} label="B" />
					<FormControlLabel control={<CheckBox />} label="C" />
				</FormGroup>
			</Stack>
		</Demo>
	);
}

export function ClickAwayListenerDemo() {
	const [open, setOpen] = useState(false);
	return (
		<Demo>
			<div style={{ position: "relative" }}>
				<Button variant="outlined" onClick={() => setOpen(true)}>
					Open panel
				</Button>
				{open && (
					<ClickAwayListener onClickAway={() => setOpen(false)}>
						<Paper
							elevation={6}
							style={{
								position: "absolute",
								top: "100%",
								left: 0,
								marginTop: 8,
								padding: 16,
								minWidth: 200,
								zIndex: 10,
							}}
						>
							Click outside to close.
						</Paper>
					</ClickAwayListener>
				)}
			</div>
		</Demo>
	);
}

export function CssBaselineDemo() {
	return (
		<Demo>
			<div style={{ width: "100%" }}>
				<Typography>
					CssBaseline injects a global reset (box-sizing, font smoothing,
					body margins). Prefer importing{" "}
					<code>@shpaw415/mui-lite/style.css</code> once at the app root; use
					the component when you need the reset scoped with a theme tree.
				</Typography>
				<pre
					style={{
						marginTop: 12,
						padding: 12,
						fontSize: 12,
						overflow: "auto",
						background: "rgba(0,0,0,0.04)",
						borderRadius: 8,
					}}
				>
					{`import CssBaseline from "@shpaw415/mui-lite/CssBaseline";
import { ThemeProvider, DefaultTheme } from "@shpaw415/mui-lite/theme";

<ThemeProvider theme={DefaultTheme}>
  <CssBaseline />
  {children}
</ThemeProvider>`}
				</pre>
			</div>
		</Demo>
	);
}

export function TablePaginationDemo() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState<10 | 25 | 50 | 100>(10);
	return (
		<Demo>
			<div style={{ width: "100%" }}>
				<TablePagination
					count={100}
					page={page}
					rowsPerPage={rowsPerPage}
					onPageChange={(_e, p) => setPage(p)}
					onRowsPerPageChange={(r) => {
						setRowsPerPage(r);
						setPage(0);
					}}
				/>
			</div>
		</Demo>
	);
}

export function LocaleDemo() {
	return (
		<Demo>
			<div style={{ width: "100%" }}>
				<Typography>
					Locales live under{" "}
					<code>@shpaw415/mui-lite/locale</code>. Set{" "}
					<code>theme.locale</code> on your MuiTheme (e.g.{" "}
					<code>frFR</code>, <code>deDE</code>, <code>jaJP</code>). Components
					such as Pagination and Alert read strings via{" "}
					<code>useLanguages</code>.
				</Typography>
				<pre
					style={{
						marginTop: 12,
						padding: 12,
						fontSize: 12,
						overflow: "auto",
						background: "rgba(0,0,0,0.04)",
						borderRadius: 8,
					}}
				>
					{`import { DefaultTheme } from "@shpaw415/mui-lite/theme";

const theme = {
  ...DefaultTheme,
  locale: "frFR" as const,
};

// Available: enUS, frFR, deDE, esES, jaJP, zhCN, ptBR, …
// See mui/locale for the full SupportedLocalesType list.`}
				</pre>
			</div>
		</Demo>
	);
}
