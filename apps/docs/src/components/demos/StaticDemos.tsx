"use client";

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
import Stack from "@shpaw415/mui-lite/Stack";
import Table, {
	TableBody,
	TableCell,
	TableContainer,
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

export function TableDemo() {
	return (
		<Demo>
			<TableContainer>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>Dessert</TableCell>
							<TableCell align="right">
								<TableSortLabel active direction="desc">
									Calories
								</TableSortLabel>
							</TableCell>
							<TableCell align="right">Fat g</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow hover>
							<TableCell>Frozen yoghurt</TableCell>
							<TableCell align="right">159</TableCell>
							<TableCell align="right">6</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Ice cream sandwich</TableCell>
							<TableCell align="right">237</TableCell>
							<TableCell align="right">9</TableCell>
						</TableRow>
						<TableRow hover selected>
							<TableCell>Eclair</TableCell>
							<TableCell align="right">262</TableCell>
							<TableCell align="right">16</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</Demo>
	);
}
