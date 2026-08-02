"use client";

import { useMemo, useState } from "react";
import AppBar from "@shpaw415/mui-lite/AppBar";
import Breadcrumbs from "@shpaw415/mui-lite/Breadcrumbs";
import Button, { ButtonGroup } from "@shpaw415/mui-lite/Button";
import ButtonBase from "@shpaw415/mui-lite/ButtonBase";
import Card, {
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
} from "@shpaw415/mui-lite/Card";
import CheckBox from "@shpaw415/mui-lite/CheckBox";
import Container from "@shpaw415/mui-lite/Container";
import Divider from "@shpaw415/mui-lite/Divider";
import FormControl from "@shpaw415/mui-lite/FormControl";
import FormHelperText from "@shpaw415/mui-lite/FormHelperText";
import Grid from "@shpaw415/mui-lite/Grid";
import Input, { FilledInput, OutlinedInput } from "@shpaw415/mui-lite/Input";
import InputAdornment from "@shpaw415/mui-lite/InputAdornment";
import InputLabel from "@shpaw415/mui-lite/InputLabel";
import Link from "@shpaw415/mui-lite/Link";
import NativeSelect from "@shpaw415/mui-lite/NativeSelect";
import Paper from "@shpaw415/mui-lite/Paper";
import { TablePagination } from "@shpaw415/mui-lite/Pagination";
import Stack from "@shpaw415/mui-lite/Stack";
import Table, {
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TableRow,
	TableSortLabel,
} from "@shpaw415/mui-lite/Table";
import Toolbar from "@shpaw415/mui-lite/Toolbar";
import Typography from "@shpaw415/mui-lite/Typography";
import { Demo } from "../Demo";

export function ButtonDemo() {
	return (
		<>
			<Demo title="Variants">
				<Stack direction="row" spacing={1}>
					<Button variant="contained">Contained</Button>
					<Button variant="outlined">Outlined</Button>
					<Button variant="text">Text</Button>
				</Stack>
			</Demo>
			<Demo title="Colors">
				<Stack direction="row" spacing={1}>
					<Button color="primary">Primary</Button>
					<Button color="secondary">Secondary</Button>
					<Button color="error">Error</Button>
					<Button color="warning">Warning</Button>
					<Button color="success">Success</Button>
				</Stack>
			</Demo>
			<Demo title="Sizes">
				<Stack spacing={1}>
					<Stack direction="row" spacing={1}>
						<Button size="small">Small</Button>
						<Button size="medium">Medium</Button>
						<Button size="large">Large</Button>
					</Stack>
					<Button fullWidth>Full width</Button>
				</Stack>
			</Demo>
			<Demo title="ButtonGroup">
				<ButtonGroup variant="outlined">
					<Button>One</Button>
					<Button>Two</Button>
					<Button>Three</Button>
				</ButtonGroup>
			</Demo>
		</>
	);
}

export function ButtonBaseDemo() {
	return (
		<Demo>
			<ButtonBase
				style={{
					padding: "12px 24px",
					border: "1px solid currentColor",
					borderRadius: 8,
				}}
			>
				ButtonBase
			</ButtonBase>
		</Demo>
	);
}

export function StackDemo() {
	return (
		<>
			<Demo title="Row">
				<Stack direction="row" spacing={2}>
					<Button variant="contained">One</Button>
					<Button variant="contained">Two</Button>
					<Button variant="contained">Three</Button>
				</Stack>
			</Demo>
			<Demo title="Column + divider">
				<Stack spacing={1} divider={<Divider />}>
					<Button variant="text">Item A</Button>
					<Button variant="text">Item B</Button>
					<Button variant="text">Item C</Button>
				</Stack>
			</Demo>
		</>
	);
}

export function ContainerDemo() {
	return (
		<Demo>
			<Container maxWidth="sm">
				<Paper elevation={2} style={{ padding: 16 }}>
					<Typography>maxWidth sm</Typography>
				</Paper>
			</Container>
		</Demo>
	);
}

export function GridDemo() {
	return (
		<Demo>
			<Grid container spacing={2} style={{ width: "100%" }}>
				<Grid size={8}>
					<Paper elevation={2} style={{ padding: 12 }}>
						size=8
					</Paper>
				</Grid>
				<Grid size={4}>
					<Paper elevation={2} style={{ padding: 12 }}>
						size=4
					</Paper>
				</Grid>
				<Grid size={6}>
					<Paper elevation={2} style={{ padding: 12 }}>
						size=6
					</Paper>
				</Grid>
				<Grid size={6}>
					<Paper elevation={2} style={{ padding: 12 }}>
						size=6
					</Paper>
				</Grid>
			</Grid>
		</Demo>
	);
}

export function AppBarDemo() {
	return (
		<>
			<Demo title="Primary">
				<div style={{ width: "100%", position: "relative" }}>
					<AppBar position="static" color="primary">
						<Toolbar>
							<Typography
								Element="h1"
								sx={{ flexGrow: 1, m: 0, typography: "h6" }}
							>
								News
							</Typography>
							<Button color="primary" variant="text">
								Login
							</Button>
						</Toolbar>
					</AppBar>
				</div>
			</Demo>
			<Demo title="Default (surface)">
				<div style={{ width: "100%", position: "relative" }}>
					<AppBar position="static" color="default" elevation={1}>
						<Toolbar>
							<Typography
								Element="h1"
								sx={{ flexGrow: 1, m: 0, typography: "h6" }}
							>
								Settings
							</Typography>
							<Button variant="text">Account</Button>
						</Toolbar>
					</AppBar>
				</div>
			</Demo>
		</>
	);
}

export function CardDemo() {
	return (
		<Demo>
			<Card style={{ maxWidth: 345 }}>
				<CardHeader
					title="Shrimp and Chorizo Paella"
					subheader="September 14, 2016"
				/>
				<CardMedia
					image="https://mui.com/static/images/cards/paella.jpg"
					style={{ height: 140 }}
					title="Paella"
				/>
				<CardContent>
					<Typography>
						This impressive paella is a perfect party dish and a fun meal to
						cook.
					</Typography>
				</CardContent>
				<CardActions>
					<Button size="small">Share</Button>
					<Button size="small">Learn More</Button>
				</CardActions>
			</Card>
		</Demo>
	);
}

export function LinkDemo() {
	return (
		<Demo>
			<Stack direction="row" spacing={2}>
				<Link href="#">always</Link>
				<Link href="#" underline="hover">
					hover
				</Link>
				<Link href="#" underline="none">
					none
				</Link>
				<Link href="#" color="secondary">
					secondary
				</Link>
			</Stack>
		</Demo>
	);
}

export function BreadcrumbsDemo() {
	return (
		<Demo>
			<Breadcrumbs>
				<Link underline="hover" href="/">
					Home
				</Link>
				<Link underline="hover" href="/docs">
					Docs
				</Link>
				<Typography>Breadcrumbs</Typography>
			</Breadcrumbs>
		</Demo>
	);
}

export function FormControlDemo() {
	return (
		<>
			<Demo title="Outlined">
				<FormControl variant="outlined" style={{ minWidth: 240 }}>
					<InputLabel>Email</InputLabel>
					<OutlinedInput />
					<FormHelperText>We will never share your email.</FormHelperText>
				</FormControl>
			</Demo>
			<Demo title="Variants + error">
				<Stack direction="row" spacing={2} flexWrap="wrap">
					<FormControl variant="standard" style={{ minWidth: 160 }}>
						<InputLabel>Standard</InputLabel>
						<Input />
					</FormControl>
					<FormControl variant="filled" style={{ minWidth: 160 }}>
						<InputLabel>Filled</InputLabel>
						<FilledInput />
					</FormControl>
					<FormControl variant="outlined" error style={{ minWidth: 160 }}>
						<InputLabel>Error</InputLabel>
						<OutlinedInput defaultValue="bad" />
						<FormHelperText>Invalid value</FormHelperText>
					</FormControl>
				</Stack>
			</Demo>
			<Demo title="Adornments">
				<FormControl variant="outlined" style={{ minWidth: 200 }}>
					<InputLabel>Amount</InputLabel>
					<OutlinedInput
						startAdornment={<InputAdornment position="start">$</InputAdornment>}
					/>
				</FormControl>
			</Demo>
		</>
	);
}

export function NativeSelectDemo() {
	return (
		<Demo>
			<Stack direction="row" spacing={2} flexWrap="wrap">
				<FormControl variant="standard" style={{ minWidth: 160 }}>
					<InputLabel>Age</InputLabel>
					<NativeSelect defaultValue="">
						<option value="" disabled />
						<option value="10">Ten</option>
						<option value="20">Twenty</option>
						<option value="30">Thirty</option>
					</NativeSelect>
					<FormHelperText>Standard</FormHelperText>
				</FormControl>
				<FormControl variant="outlined" style={{ minWidth: 160 }}>
					<InputLabel>Age</InputLabel>
					<NativeSelect defaultValue="10">
						<option value="10">Ten</option>
						<option value="20">Twenty</option>
					</NativeSelect>
				</FormControl>
				<FormControl variant="filled" style={{ minWidth: 160 }}>
					<InputLabel>Age</InputLabel>
					<NativeSelect defaultValue="20">
						<option value="10">Ten</option>
						<option value="20">Twenty</option>
					</NativeSelect>
				</FormControl>
			</Stack>
		</Demo>
	);
}

type Dessert = {
	id: string;
	name: string;
	calories: number;
	fat: number;
	carbs: number;
	protein: number;
};

const DESSERTS: Dessert[] = [
	{ id: "1", name: "Frozen yoghurt", calories: 159, fat: 6, carbs: 24, protein: 4 },
	{ id: "2", name: "Ice cream sandwich", calories: 237, fat: 9, carbs: 37, protein: 4.3 },
	{ id: "3", name: "Eclair", calories: 262, fat: 16, carbs: 24, protein: 6 },
	{ id: "4", name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
	{ id: "5", name: "Gingerbread", calories: 356, fat: 16, carbs: 49, protein: 3.9 },
	{ id: "6", name: "Jelly bean", calories: 375, fat: 0, carbs: 94, protein: 0 },
	{ id: "7", name: "Lollipop", calories: 392, fat: 0.2, carbs: 98, protein: 0 },
	{ id: "8", name: "Honeycomb", calories: 408, fat: 3.2, carbs: 87, protein: 6.5 },
	{ id: "9", name: "Donut", calories: 452, fat: 25, carbs: 51, protein: 4.9 },
	{ id: "10", name: "KitKat", calories: 518, fat: 26, carbs: 65, protein: 7 },
	{ id: "11", name: "Marshmallow", calories: 318, fat: 0.2, carbs: 81, protein: 1.8 },
	{ id: "12", name: "Nougat", calories: 360, fat: 19, carbs: 45, protein: 7 },
];

type SortKey = keyof Pick<
	Dessert,
	"name" | "calories" | "fat" | "carbs" | "protein"
>;

function compareDesserts(a: Dessert, b: Dessert, orderBy: SortKey, dir: "asc" | "desc") {
	const av = a[orderBy];
	const bv = b[orderBy];
	let cmp = 0;
	if (typeof av === "string" && typeof bv === "string") {
		cmp = av.localeCompare(bv);
	} else {
		cmp = Number(av) - Number(bv);
	}
	return dir === "asc" ? cmp : -cmp;
}

export function TableDemo() {
	const [orderBy, setOrderBy] = useState<SortKey>("calories");
	const [order, setOrder] = useState<"asc" | "desc">("asc");
	const [selected, setSelected] = useState<string[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState<10 | 25 | 50 | 100>(10);
	const [dense, setDense] = useState(true);

	const sorted = useMemo(
		() =>
			[...DESSERTS].sort((a, b) => compareDesserts(a, b, orderBy, order)),
		[orderBy, order],
	);

	const pageRows = useMemo(() => {
		const start = page * rowsPerPage;
		return sorted.slice(start, start + rowsPerPage);
	}, [sorted, page, rowsPerPage]);

	const allPageSelected =
		pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id));
	const somePageSelected =
		pageRows.some((r) => selected.includes(r.id)) && !allPageSelected;

	const handleSort = (key: SortKey) => {
		if (orderBy === key) {
			setOrder((d) => (d === "asc" ? "desc" : "asc"));
		} else {
			setOrderBy(key);
			setOrder("asc");
		}
		setPage(0);
	};

	const toggleAllPage = () => {
		if (allPageSelected) {
			const pageIds = new Set(pageRows.map((r) => r.id));
			setSelected((s) => s.filter((id) => !pageIds.has(id)));
		} else {
			setSelected((s) => {
				const next = new Set(s);
				for (const r of pageRows) next.add(r.id);
				return [...next];
			});
		}
	};

	const toggleRow = (id: string) => {
		setSelected((s) =>
			s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
		);
	};

	const selectedTotalCal = useMemo(
		() =>
			DESSERTS.filter((d) => selected.includes(d.id)).reduce(
				(sum, d) => sum + d.calories,
				0,
			),
		[selected],
	);

	const SortHead = ({
		id,
		label,
		numeric,
	}: {
		id: SortKey;
		label: string;
		numeric?: boolean;
	}) => (
		<TableCell align={numeric ? "right" : "left"} sortDirection={orderBy === id ? order : false}>
			<TableSortLabel
				active={orderBy === id}
				direction={orderBy === id ? order : "asc"}
				onClick={() => handleSort(id)}
			>
				{label}
			</TableSortLabel>
		</TableCell>
	);

	return (
		<>
			<Demo title="Interactive: sort, select, paginate">
				<div style={{ width: "100%" }}>
					<Stack
						direction="row"
						spacing={2}
						style={{
							marginBottom: 12,
							alignItems: "center",
							flexWrap: "wrap",
							gap: 8,
						}}
					>
						<Typography variant="body2" color="textSecondary">
							{selected.length === 0
								? `${DESSERTS.length} desserts`
								: `${selected.length} selected · ${selectedTotalCal} kcal`}
						</Typography>
						<span style={{ flex: 1 }} />
						<Button
							size="small"
							variant={dense ? "contained" : "outlined"}
							onClick={() => setDense((d) => !d)}
						>
							{dense ? "Dense" : "Comfortable"}
						</Button>
						{selected.length > 0 && (
							<Button
								size="small"
								variant="text"
								color="error"
								onClick={() => setSelected([])}
							>
								Clear selection
							</Button>
						)}
					</Stack>

					<TableContainer
						style={{
							maxHeight: 360,
							border: "1px solid rgba(128,128,128,0.25)",
							borderRadius: 8,
						}}
					>
						<Table size={dense ? "small" : "medium"} stickyHeader>
							<TableHead>
								<TableRow>
									<TableCell padding="checkbox">
										<CheckBox
											checked={allPageSelected}
											onChange={toggleAllPage}
											aria-label="Select all on page"
										/>
									</TableCell>
									<SortHead id="name" label="Dessert" />
									<SortHead id="calories" label="Calories" numeric />
									<SortHead id="fat" label="Fat (g)" numeric />
									<SortHead id="carbs" label="Carbs (g)" numeric />
									<SortHead id="protein" label="Protein (g)" numeric />
								</TableRow>
							</TableHead>
							<TableBody>
								{pageRows.map((row) => {
									const isSelected = selected.includes(row.id);
									return (
										<TableRow
											key={row.id}
											hover
											selected={isSelected}
											onClick={() => toggleRow(row.id)}
											style={{ cursor: "pointer" }}
										>
											<TableCell padding="checkbox">
												<span onClick={(e) => e.stopPropagation()}>
													<CheckBox
														checked={isSelected}
														onChange={() => toggleRow(row.id)}
														aria-label={`Select ${row.name}`}
													/>
												</span>
											</TableCell>
											<TableCell component="th" scope="row">
												{row.name}
											</TableCell>
											<TableCell align="right">{row.calories}</TableCell>
											<TableCell align="right">{row.fat}</TableCell>
											<TableCell align="right">{row.carbs}</TableCell>
											<TableCell align="right">{row.protein}</TableCell>
										</TableRow>
									);
								})}
								{pageRows.length === 0 && (
									<TableRow>
										<TableCell colSpan={6} align="center">
											No rows
										</TableCell>
									</TableRow>
								)}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TableCell colSpan={2}>Page total</TableCell>
									<TableCell align="right">
										{pageRows.reduce((s, r) => s + r.calories, 0)}
									</TableCell>
									<TableCell align="right">
										{pageRows.reduce((s, r) => s + r.fat, 0).toFixed(1)}
									</TableCell>
									<TableCell align="right">
										{pageRows.reduce((s, r) => s + r.carbs, 0)}
									</TableCell>
									<TableCell align="right">
										{pageRows
											.reduce((s, r) => s + r.protein, 0)
											.toFixed(1)}
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</TableContainer>

					<div style={{ marginTop: 4 }}>
						<TablePagination
							count={DESSERTS.length}
							page={page}
							rowsPerPage={rowsPerPage}
							onPageChange={(_e, p) => setPage(p)}
							onRowsPerPageChange={(r) => {
								setRowsPerPage(r);
								setPage(0);
							}}
						/>
					</div>
				</div>
			</Demo>

			<Demo title="Basic (static)">
				<TableContainer>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Dessert</TableCell>
								<TableCell align="right">Calories</TableCell>
								<TableCell align="right">Fat (g)</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{DESSERTS.slice(0, 3).map((row) => (
								<TableRow key={row.id} hover>
									<TableCell>{row.name}</TableCell>
									<TableCell align="right">{row.calories}</TableCell>
									<TableCell align="right">{row.fat}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Demo>
		</>
	);
}
