"use client";

import Box from "@shpaw415/mui-lite/Box";
import Button from "@shpaw415/mui-lite/Button";
import Paper from "@shpaw415/mui-lite/Paper";
import Stack from "@shpaw415/mui-lite/Stack";
import Typography from "@shpaw415/mui-lite/Typography";
import { useState } from "react";
import { Demo } from "../Demo";

export function SxDemo() {
	const [selected, setSelected] = useState(0);

	return (
		<>
			<Demo
				title="Card surface (spacing, palette, hover, responsive)"
				code={`<Box
  sx={{
    p: 2,
    maxWidth: 360,
    borderRadius: 2,
    bgcolor: "background.paper",
    color: "text.primary",
    border: "1px solid",
    borderColor: "divider",
    transition: "box-shadow 0.2s, transform 0.2s",
    "&:hover": {
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      transform: "translateY(-2px)",
    },
    md: { p: 3 },
  }}
>
  ...
</Box>`}
			>
				<Box
					sx={{
						p: 2,
						maxWidth: 360,
						width: "100%",
						borderRadius: 2,
						bgcolor: "background.paper",
						color: "text.primary",
						border: "1px solid",
						borderColor: "divider",
						transition: "box-shadow 0.2s ease, transform 0.2s ease",
						"&:hover": {
							boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
							transform: "translateY(-2px)",
						},
						md: { p: 3 },
					}}
				>
					<Typography sx={{ typography: "h6", mb: 1 }}>Product card</Typography>
					<Typography sx={{ color: "text.secondary", typography: "body2", mb: 2 }}>
						Hover for elevation. Padding grows at the md breakpoint.
					</Typography>
					<Button variant="contained" size="small">
						Add to cart
					</Button>
				</Box>
			</Demo>

			<Demo
				title="Responsive layout"
				code={`<Stack
  direction={{ xs: "column", sm: "row" } as any}
  // or use nested bags / width fractions:
/>
<Box sx={{
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  gap: 2,
  width: 1,
}}>
  <Box sx={{ width: { xs: 1, md: 0.4 }, p: 2, bgcolor: "primary.light" }}>
    Sidebar
  </Box>
  <Box sx={{ width: { xs: 1, md: 0.6 }, p: 2, bgcolor: "background.paper" }}>
    Main
  </Box>
</Box>`}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						gap: 2,
						width: 1,
					}}
				>
					<Box
						sx={{
							width: { xs: 1, md: 0.35 },
							p: 2,
							borderRadius: 1,
							bgcolor: "primary.main",
							color: "#fff",
							typography: "body2",
						}}
					>
						Sidebar · full width on xs, 35% from md
					</Box>
					<Box
						sx={{
							width: { xs: 1, md: 0.65 },
							p: 2,
							borderRadius: 1,
							bgcolor: "background.paper",
							border: "1px solid",
							borderColor: "divider",
							typography: "body2",
						}}
					>
						Main · full width on xs, 65% from md
					</Box>
				</Box>
			</Demo>

			<Demo
				title="Theme callback + conditional array"
				code={`const [selected, setSelected] = useState(0);

{items.map((label, i) => (
  <Box
    key={label}
    onClick={() => setSelected(i)}
    sx={[
      {
        px: 2,
        py: 1,
        borderRadius: 1,
        cursor: "pointer",
        typography: "body2",
        transition: "background-color 0.15s",
        "&:hover": { bgcolor: "action.hover" },
      },
      (theme) => ({
        color: theme.theme === "dark" ? "#eee" : "#222",
      }),
      selected === i && {
        bgcolor: "primary.main",
        color: "#fff",
        "&:hover": { bgcolor: "primary.dark" },
      },
    ]}
  >
    {label}
  </Box>
))}`}
			>
				<Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
					{["Overview", "Specs", "Reviews"].map((label, i) => (
						<Box
							key={label}
							onClick={() => setSelected(i)}
							sx={[
								{
									px: 2,
									py: 1,
									borderRadius: 1,
									cursor: "pointer",
									typography: "body2",
									userSelect: "none",
									border: "1px solid",
									borderColor: "divider",
									transition: "background-color 0.15s, color 0.15s",
								},
								(theme) => ({
									color: theme.theme === "dark" ? "#eee" : "#222",
								}),
								selected === i && {
									bgcolor: "primary.main",
									color: "#fff",
									borderColor: "primary.main",
									"&:hover": { bgcolor: "primary.dark" },
								},
							]}
						>
							{label}
						</Box>
					))}
				</Stack>
			</Demo>

			<Demo
				title="Nested selectors"
				code={`<Paper
  sx={{
    p: 2,
    "& .title": { typography: "subtitle2", mb: 0.5 },
    "& .meta": { typography: "caption", color: "text.secondary" },
    "&:hover .title": { color: "primary.main" },
  }}
>
  <div className="title">Nested title</div>
  <div className="meta">Hover the card to recolor the title</div>
</Paper>`}
			>
				<Paper
					elevation={1}
					sx={{
						p: 2,
						maxWidth: 320,
						width: "100%",
						cursor: "default",
						"& .title": { typography: "subtitle2", mb: 0.5 },
						"& .meta": { typography: "caption", color: "text.secondary" },
						"&:hover .title": { color: "primary.main" },
					}}
				>
					<div className="title">Nested title</div>
					<div className="meta">Hover the card to recolor the title</div>
				</Paper>
			</Demo>

			<Demo
				title="Status chips (palette paths)"
				code={`const tones = [
  { label: "Success", color: "success.main" },
  { label: "Warning", color: "warning.main" },
  { label: "Error", color: "error.main" },
  { label: "Info", color: "info.main" },
];

{tones.map((t) => (
  <Box
    key={t.label}
    sx={{
      px: 1.5,
      py: 0.5,
      borderRadius: 4,
      typography: "caption",
      fontWeight: 600,
      color: t.color,
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: t.color,
    }}
  >
    {t.label}
  </Box>
))}`}
			>
				<Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
					{(
						[
							{ label: "Success", color: "success.main" },
							{ label: "Warning", color: "warning.main" },
							{ label: "Error", color: "error.main" },
							{ label: "Info", color: "info.main" },
						] as const
					).map((t) => (
						<Box
							key={t.label}
							sx={{
								px: 1.5,
								py: 0.5,
								borderRadius: 4,
								typography: "caption",
								fontWeight: 600,
								color: t.color,
								bgcolor: "background.paper",
								border: "1px solid",
								borderColor: t.color,
							}}
						>
							{t.label}
						</Box>
					))}
				</Stack>
			</Demo>
		</>
	);
}
