"use client";

import { useRef, useState, type ReactNode } from "react";
import Accordion, {
	AccordionDetails,
	AccordionSummary,
} from "@shpaw415/mui-lite/Accordion";
import Alert from "@shpaw415/mui-lite/Alert";
import AutoComplete from "@shpaw415/mui-lite/AutoComplete";
import Avatar, { AvatarGroup } from "@shpaw415/mui-lite/Avatar";
import Backdrop from "@shpaw415/mui-lite/Backdrop";
import Badge from "@shpaw415/mui-lite/Badge";
import Button from "@shpaw415/mui-lite/Button";
import CheckBox from "@shpaw415/mui-lite/CheckBox";
import Chip from "@shpaw415/mui-lite/Chip";
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@shpaw415/mui-lite/Dialog";
import Divider from "@shpaw415/mui-lite/Divider";
import Drawer from "@shpaw415/mui-lite/Drawer";
import FAB from "@shpaw415/mui-lite/FloatingActionButton";
import IconButton from "@shpaw415/mui-lite/IconButton";
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@shpaw415/mui-lite/List";
import Menu from "@shpaw415/mui-lite/Menu";
import Pagination from "@shpaw415/mui-lite/Pagination";
import Paper from "@shpaw415/mui-lite/Paper";
import { CircularProgress, LinearProgress } from "@shpaw415/mui-lite/Progress";
import Radio from "@shpaw415/mui-lite/Radio";
import Select from "@shpaw415/mui-lite/Select";
import Skeleton from "@shpaw415/mui-lite/Skeleton";
import Slider from "@shpaw415/mui-lite/Slider";
import Snackbar from "@shpaw415/mui-lite/Snackbar";
import SpeedDial, { SpeedDialAction } from "@shpaw415/mui-lite/SpeedDial";
import Stack from "@shpaw415/mui-lite/Stack";
import Switch from "@shpaw415/mui-lite/Switch";
import TextField from "@shpaw415/mui-lite/TextField";
import ToggleButton, { ToggleButtonGroup } from "@shpaw415/mui-lite/Toggle";
import ToolTip from "@shpaw415/mui-lite/ToolTip";
import Typography from "@shpaw415/mui-lite/Typography";
import { Demo } from "../Demo";

function Icon({ children }: { children: ReactNode }) {
	return (
		<span
			style={{
				fontSize: "1em",
				lineHeight: 1,
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{children}
		</span>
	);
}

export function TypographyDemo() {
	return (
		<Demo>
			<Stack spacing={1}>
				<Typography Element="h1">h1 Heading</Typography>
				<Typography Element="h2">h2 Heading</Typography>
				<Typography Element="p">Body paragraph text.</Typography>
				<Typography color="primary">Primary color</Typography>
				<Typography color="error">Error color</Typography>
			</Stack>
		</Demo>
	);
}

export function PaperDemo() {
	return (
		<Demo>
			<Stack direction="row" spacing={2} flexWrap="wrap">
				<Paper elevation={1} style={{ padding: 16, minWidth: 100 }}>
					elevation 1
				</Paper>
				<Paper elevation={8} style={{ padding: 16, minWidth: 100 }}>
					elevation 8
				</Paper>
				<Paper variant="outlined" style={{ padding: 16, minWidth: 100 }}>
					outlined
				</Paper>
			</Stack>
		</Demo>
	);
}

export function DividerDemo() {
	return (
		<Demo>
			<div style={{ width: "100%", maxWidth: 360 }}>
				<Typography>Above</Typography>
				<Divider />
				<Typography>Below</Typography>
				<Divider>OR</Divider>
				<Stack direction="row" spacing={2} style={{ height: 48, alignItems: "center" }}>
					<span>Left</span>
					<Divider orientation="vertical" />
					<span>Right</span>
				</Stack>
			</div>
		</Demo>
	);
}

export function AlertDemo() {
	return (
		<Demo>
			<Stack spacing={1} style={{ width: "100%" }}>
				<Alert severity="success">Success — saved.</Alert>
				<Alert severity="info" variant="outlined">
					Info — heads up.
				</Alert>
				<Alert severity="warning" variant="filled" title="Warning">
					Check your input.
				</Alert>
				<Alert severity="error" onClose={() => {}}>
					Error — something failed.
				</Alert>
			</Stack>
		</Demo>
	);
}

export function AvatarDemo() {
	return (
		<Demo>
			<Stack direction="row" spacing={2} alignItems="center">
				<Avatar>A</Avatar>
				<Avatar src="https://mui.com/static/images/avatar/1.jpg" alt="User">
					U
				</Avatar>
				<AvatarGroup max={3}>
					<Avatar>A</Avatar>
					<Avatar>B</Avatar>
					<Avatar>C</Avatar>
					<Avatar>D</Avatar>
				</AvatarGroup>
			</Stack>
		</Demo>
	);
}

export function BadgeDemo() {
	return (
		<Demo>
			<Stack direction="row" spacing={3} alignItems="center">
				<Badge badgeContent={4} color="primary">
					<Avatar>M</Avatar>
				</Badge>
				<Badge badgeContent={120} color="error">
					<Icon>✉</Icon>
				</Badge>
				<Badge variant="dot" color="secondary">
					<Icon>●</Icon>
				</Badge>
			</Stack>
		</Demo>
	);
}

export function ChipDemo() {
	return (
		<Demo>
			<Stack direction="row" spacing={1} flexWrap="wrap">
				<Chip>Default</Chip>
				<Chip color="primary">Primary</Chip>
				<Chip variant="outlined" color="secondary">
					Outlined
				</Chip>
				<Chip onDelete={() => {}} color="error">
					Deletable
				</Chip>
			</Stack>
		</Demo>
	);
}

export function IconButtonDemo() {
	return (
		<>
			<Demo title="Sizes">
				<Stack direction="row" spacing={2} alignItems="center">
					<Stack alignItems="center" spacing={0.5}>
						<IconButton color="primary" size="small" aria-label="small">
							<Icon>★</Icon>
						</IconButton>
						<span style={{ fontSize: 12, opacity: 0.7 }}>small</span>
					</Stack>
					<Stack alignItems="center" spacing={0.5}>
						<IconButton color="primary" size="medium" aria-label="medium">
							<Icon>★</Icon>
						</IconButton>
						<span style={{ fontSize: 12, opacity: 0.7 }}>medium</span>
					</Stack>
					<Stack alignItems="center" spacing={0.5}>
						<IconButton color="primary" size="large" aria-label="large">
							<Icon>★</Icon>
						</IconButton>
						<span style={{ fontSize: 12, opacity: 0.7 }}>large</span>
					</Stack>
				</Stack>
			</Demo>
			<Demo title="Colors">
				<Stack direction="row" spacing={1}>
					<IconButton color="primary" aria-label="primary">
						<Icon>♥</Icon>
					</IconButton>
					<IconButton color="secondary" aria-label="secondary">
						<Icon>★</Icon>
					</IconButton>
					<IconButton color="error" aria-label="error">
						<Icon>×</Icon>
					</IconButton>
				</Stack>
			</Demo>
		</>
	);
}

export function FabDemo() {
	return (
		<Demo>
			<Stack direction="row" spacing={2} alignItems="center">
				<FAB color="primary" aria-label="add">
					+
				</FAB>
				<FAB color="secondary" size="small">
					✎
				</FAB>
				<FAB variant="extended" color="primary">
					<span style={{ marginRight: 8 }}>+</span> Create
				</FAB>
			</Stack>
		</Demo>
	);
}

export function SkeletonDemo() {
	return (
		<Demo>
			<Stack spacing={1} style={{ width: 240 }}>
				<Skeleton variant="text" width="80%" />
				<Skeleton variant="circular" width={40} height={40} />
				<Skeleton variant="rectangular" width="100%" height={80} />
				<Skeleton variant="rounded" width="100%" height={48} />
			</Stack>
		</Demo>
	);
}

export function ProgressDemo() {
	return (
		<Demo>
			<Stack spacing={2} style={{ width: "100%", maxWidth: 320 }}>
				<CircularProgress color="primary" />
				<CircularProgress variant="determinate" value={65} color="secondary" />
				<LinearProgress />
				<LinearProgress variant="determinate" value={40} color="success" />
			</Stack>
		</Demo>
	);
}

export function SwitchDemo() {
	return (
		<Demo>
			<Stack spacing={1}>
				<Switch defaultChecked label="Enabled" />
				<Switch label="Off" />
				<Switch defaultChecked color="secondary" label="Secondary" />
				<Switch disabled label="Disabled" />
			</Stack>
		</Demo>
	);
}

export function CheckBoxDemo() {
	return (
		<Demo>
			<Stack spacing={1}>
				<CheckBox defaultChecked label="Checked" />
				<CheckBox label="Unchecked" />
				<CheckBox color="secondary" defaultChecked label="Secondary" />
				<CheckBox disabled label="Disabled" />
			</Stack>
		</Demo>
	);
}

export function RadioDemo() {
	return (
		<Demo>
			<Stack direction="row" spacing={2}>
				<label style={{ display: "flex", alignItems: "center", gap: 4 }}>
					<Radio name="r" defaultChecked value="a" /> A
				</label>
				<label style={{ display: "flex", alignItems: "center", gap: 4 }}>
					<Radio name="r" value="b" /> B
				</label>
			</Stack>
		</Demo>
	);
}

export function SliderDemo() {
	return (
		<Demo>
			<div style={{ width: "100%", maxWidth: 280, padding: "8px 12px" }}>
				<Slider defaultValue={30} />
				<Slider defaultValue={[20, 60]} style={{ marginTop: 24 }} />
			</div>
		</Demo>
	);
}

export function TextFieldDemo() {
	return (
		<>
			<Demo title="Variants">
				<Stack
					spacing={3}
					style={{ width: "100%", maxWidth: 320, paddingTop: 8 }}
				>
					<TextField label="Standard" variant="standard" defaultValue="" />
					<TextField label="Outlined" variant="outlined" defaultValue="" />
					<TextField
						label="Filled"
						variant="filled"
						helpText="Helper text under filled field"
						defaultValue=""
					/>
					<TextField
						label="With value"
						variant="outlined"
						defaultValue="Hello mui-lite"
						helpText="Label stays floated when filled"
					/>
				</Stack>
			</Demo>
			<Demo title="Multiline">
				<Stack
					spacing={3}
					style={{ width: "100%", maxWidth: 360, paddingTop: 8 }}
				>
					<TextField
						label="Notes"
						variant="outlined"
						multiline
						defaultValue=""
						helpText="Boolean multiline → textarea"
					/>
					<TextField
						label="Description"
						variant="filled"
						multiline={{ minRows: 3, maxRows: 6 }}
						defaultValue="Supports minRows / maxRows config."
						helpText="multiline={{ minRows: 3, maxRows: 6 }}"
					/>
					<TextField
						label="Bio"
						variant="standard"
						multiline={{ minRows: 2 }}
						defaultValue=""
					/>
				</Stack>
			</Demo>
		</>
	);
}

export function SelectDemo() {
	return (
		<Demo>
			<div style={{ minWidth: 200 }}>
				<Select name="fruit" label="Fruit" defaultValue="apple">
					<option value="apple">Apple</option>
					<option value="banana">Banana</option>
					<option value="cherry">Cherry</option>
				</Select>
			</div>
		</Demo>
	);
}

export function AutoCompleteDemo() {
	return (
		<Demo>
			<div style={{ minWidth: 240 }}>
				<AutoComplete
					options={["Apple", "Banana", "Cherry", "Date", "Elderberry"]}
					onSelect={() => {}}
				/>
			</div>
		</Demo>
	);
}

export function ToggleDemo() {
	const [selected, setSelected] = useState("left");
	return (
		<Demo>
			<ToggleButtonGroup>
				<ToggleButton
					selected={selected === "left"}
					onClick={() => setSelected("left")}
				>
					Left
				</ToggleButton>
				<ToggleButton
					selected={selected === "center"}
					onClick={() => setSelected("center")}
				>
					Center
				</ToggleButton>
				<ToggleButton
					selected={selected === "right"}
					onClick={() => setSelected("right")}
				>
					Right
				</ToggleButton>
			</ToggleButtonGroup>
		</Demo>
	);
}

export function ListDemo() {
	return (
		<Demo>
			<Paper style={{ width: 280 }}>
				<List>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<Icon>☰</Icon>
							</ListItemIcon>
							<ListItemText primary="Inbox" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<Icon>★</Icon>
							</ListItemIcon>
							<ListItemText primary="Starred" secondary="Important" />
						</ListItemButton>
					</ListItem>
				</List>
			</Paper>
		</Demo>
	);
}

export function AccordionDemo() {
	return (
		<Demo>
			<div style={{ width: "100%", maxWidth: 400 }}>
				<Accordion
					defaultExpended
					Summary={<AccordionSummary>Accordion 1</AccordionSummary>}
				>
					<AccordionDetails>Content for the first panel.</AccordionDetails>
				</Accordion>
				<Accordion Summary={<AccordionSummary>Accordion 2</AccordionSummary>}>
					<AccordionDetails>Content for the second panel.</AccordionDetails>
				</Accordion>
			</div>
		</Demo>
	);
}

export function DialogDemo() {
	const [open, setOpen] = useState(false);
	return (
		<Demo>
			<>
				<Button variant="contained" onClick={() => setOpen(true)}>
					Open dialog
				</Button>
				<Dialog open={open} onClose={() => setOpen(false)}>
					<DialogTitle>Subscribe</DialogTitle>
					<DialogContent>
						To subscribe, please enter your email.
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setOpen(false)} variant="text">
							Cancel
						</Button>
						<Button onClick={() => setOpen(false)} variant="contained">
							Subscribe
						</Button>
					</DialogActions>
				</Dialog>
			</>
		</Demo>
	);
}

function DrawerNav({
	title,
	onNavigate,
}: {
	title: string;
	onNavigate?: () => void;
}) {
	const items = ["Home", "Inbox", "Starred", "Settings"];
	return (
		<div style={{ width: "100%", padding: "8px 0" }}>
			<div style={{ padding: "16px 16px 8px" }}>
				<Typography Element="h3" sx={{ typography: "h6", m: 0 }}>
					{title}
				</Typography>
				<Typography sx={{ typography: "caption", color: "text.secondary" }}>
					Navigation
				</Typography>
			</div>
			<Divider />
			<List>
				{items.map((label) => (
					<ListItem key={label} disablePadding>
						<ListItemButton onClick={onNavigate}>
							<ListItemIcon>
								<Icon>{label[0]}</Icon>
							</ListItemIcon>
							<ListItemText primary={label} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</div>
	);
}

export function DrawerDemo() {
	const [left, setLeft] = useState(false);
	const [right, setRight] = useState(false);
	const [top, setTop] = useState(false);
	const [bottom, setBottom] = useState(false);
	const [persistent, setPersistent] = useState(true);

	return (
		<>
			<Demo
				title="Temporary — anchors"
				code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>
<Drawer open={open} onClose={() => setOpen(false)} anchor="left" width={280}>
  <nav>…</nav>
</Drawer>`}
			>
				<Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
					<Button variant="outlined" onClick={() => setLeft(true)}>
						Left
					</Button>
					<Button variant="outlined" onClick={() => setRight(true)}>
						Right
					</Button>
					<Button variant="outlined" onClick={() => setTop(true)}>
						Top
					</Button>
					<Button variant="outlined" onClick={() => setBottom(true)}>
						Bottom
					</Button>
				</Stack>
				<Drawer open={left} onClose={() => setLeft(false)} anchor="left" width={280}>
					<DrawerNav title="Left drawer" onNavigate={() => setLeft(false)} />
				</Drawer>
				<Drawer
					open={right}
					onClose={() => setRight(false)}
					anchor="right"
					width={300}
				>
					<DrawerNav title="Right drawer" onNavigate={() => setRight(false)} />
				</Drawer>
				<Drawer open={top} onClose={() => setTop(false)} anchor="top">
					<div style={{ padding: 24 }}>
						<Typography sx={{ typography: "subtitle1", mb: 1 }}>
							Top drawer
						</Typography>
						<Typography sx={{ typography: "body2", color: "text.secondary", mb: 2 }}>
							Useful for mobile filters or a compact app bar menu.
						</Typography>
						<Button variant="contained" onClick={() => setTop(false)}>
							Close
						</Button>
					</div>
				</Drawer>
				<Drawer open={bottom} onClose={() => setBottom(false)} anchor="bottom">
					<div style={{ padding: 24 }}>
						<Typography sx={{ typography: "subtitle1", mb: 1 }}>
							Bottom sheet
						</Typography>
						<Stack direction="row" spacing={1}>
							<Button variant="outlined" onClick={() => setBottom(false)}>
								Cancel
							</Button>
							<Button variant="contained" onClick={() => setBottom(false)}>
								Confirm
							</Button>
						</Stack>
					</div>
				</Drawer>
			</Demo>

			<Demo
				title="Persistent (in-layout)"
				code={`const [open, setOpen] = useState(true);

<div style={{ display: "flex", minHeight: 200 }}>
  <Drawer variant="persistent" open={open} width={200} anchor="left">
    <nav>…</nav>
  </Drawer>
  <main style={{ flex: 1, padding: 16 }}>
    <Button onClick={() => setOpen((o) => !o)}>Toggle</Button>
  </main>
</div>`}
			>
				<div
					style={{
						display: "flex",
						width: "100%",
						minHeight: 220,
						border: "1px solid var(--color-border, #333)",
						borderRadius: 8,
						overflow: "hidden",
					}}
				>
					<Drawer
						variant="persistent"
						open={persistent}
						width={200}
						anchor="left"
						// stays in flex flow — not portaled
					>
						<DrawerNav title="Menu" />
					</Drawer>
					<div style={{ flex: 1, padding: 16, minWidth: 0 }}>
						<Stack spacing={1}>
							<Button
								variant="contained"
								onClick={() => setPersistent((o) => !o)}
							>
								{persistent ? "Hide" : "Show"} persistent drawer
							</Button>
							<Typography sx={{ typography: "body2", color: "text.secondary" }}>
								Persistent drawers push content and stay in the document flow
								(no backdrop, no portal).
							</Typography>
						</Stack>
					</div>
				</div>
			</Demo>

			<Demo
				title="Permanent"
				code={`<div style={{ display: "flex" }}>
  <Drawer variant="permanent" open width={200}>
    <nav>Always visible</nav>
  </Drawer>
  <main style={{ flex: 1 }}>Content</main>
</div>`}
			>
				<div
					style={{
						display: "flex",
						width: "100%",
						minHeight: 160,
						border: "1px solid var(--color-border, #333)",
						borderRadius: 8,
						overflow: "hidden",
					}}
				>
					<Drawer variant="permanent" open width={180} anchor="left">
						<div style={{ padding: 12 }}>
							<Typography sx={{ typography: "subtitle2" }}>Always on</Typography>
							<List dense>
								{["Dash", "Reports", "Team"].map((t) => (
									<ListItem key={t} disablePadding>
										<ListItemButton>
											<ListItemText primary={t} />
										</ListItemButton>
									</ListItem>
								))}
							</List>
						</div>
					</Drawer>
					<div style={{ flex: 1, padding: 16 }}>
						<Typography sx={{ typography: "body2" }}>
							Permanent drawers are always open in the layout.
						</Typography>
					</div>
				</div>
			</Demo>
		</>
	);
}

export function MenuDemo() {
	const [open, setOpen] = useState(false);
	const anchor = useRef<HTMLButtonElement | null>(null);
	return (
		<Demo>
			<>
				<Button
					ref={anchor as any}
					variant="outlined"
					onClick={() => setOpen((o) => !o)}
				>
					{open ? "Close menu" : "Open menu"}
				</Button>
				<Menu
					open={open}
					onClose={() => setOpen(false)}
					anchorEl={anchor}
					style={{ minWidth: 160 }}
				>
					<List dense>
						<ListItem disablePadding>
							<ListItemButton onClick={() => setOpen(false)}>
								<ListItemText primary="Profile" />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton onClick={() => setOpen(false)}>
								<ListItemText primary="My account" />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton onClick={() => setOpen(false)}>
								<ListItemText primary="Logout" />
							</ListItemButton>
						</ListItem>
					</List>
				</Menu>
			</>
		</Demo>
	);
}

export function SnackbarDemo() {
	const [open, setOpen] = useState(false);
	return (
		<Demo>
			<>
				<Button variant="contained" onClick={() => setOpen(true)}>
					Show snackbar
				</Button>
				<Snackbar
					open={open}
					onClose={() => setOpen(false)}
					autoHideDuration={3000}
					position="bottom-center"
					message="Note archived"
					action={
						<Button size="small" variant="text" onClick={() => setOpen(false)}>
							Undo
						</Button>
					}
				/>
			</>
		</Demo>
	);
}

export function BackdropDemo() {
	const [open, setOpen] = useState(false);
	return (
		<Demo>
			<>
				<Button variant="outlined" onClick={() => setOpen(true)}>
					Show backdrop
				</Button>
				<Backdrop open={open} onClick={() => setOpen(false)}>
					<CircularProgress color="primary" />
				</Backdrop>
			</>
		</Demo>
	);
}

export function PaginationDemo() {
	const [page, setPage] = useState(1);
	return (
		<Demo>
			<Pagination
				count={10}
				page={page}
				onChange={(_e, p) => setPage(p)}
				color="primary"
			/>
		</Demo>
	);
}

export function TooltipDemo() {
	return (
		<Demo>
			<Stack direction="row" spacing={2}>
				<ToolTip title="Delete" placement="top">
					<Button variant="outlined">Hover me</Button>
				</ToolTip>
				<ToolTip title="With arrow" arrow placement="bottom">
					<IconButton color="primary">
						<Icon>?</Icon>
					</IconButton>
				</ToolTip>
			</Stack>
		</Demo>
	);
}

export function SpeedDialDemo() {
	const [open, setOpen] = useState(false);
	return (
		<Demo>
			<div style={{ position: "relative", height: 180, width: "100%" }}>
				<SpeedDial
					open={open}
					onOpen={() => setOpen(true)}
					onClose={() => setOpen(false)}
					aria-label="SpeedDial"
					style={{ position: "absolute", bottom: 16, right: 16 }}
					icon={<span>+</span>}
				>
					<SpeedDialAction icon={<Icon>✉</Icon>} tooltipTitle="Mail" />
					<SpeedDialAction icon={<Icon>★</Icon>} tooltipTitle="Star" />
					<SpeedDialAction icon={<Icon>✎</Icon>} tooltipTitle="Edit" />
				</SpeedDial>
			</div>
		</Demo>
	);
}
