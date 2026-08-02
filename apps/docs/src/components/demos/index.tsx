"use client";

import BottomNavigation, {
	BottomNavigationAction,
} from "@shpaw415/mui-lite/BottomNavigation";
import Box from "@shpaw415/mui-lite/Box";
import Button from "@shpaw415/mui-lite/Button";
import Collapse from "@shpaw415/mui-lite/Collapse";
import ImageList, {
	ImageListItem,
	ImageListItemBar,
} from "@shpaw415/mui-lite/ImageList";
import MobileStepper from "@shpaw415/mui-lite/MobileStepper";
import Modal from "@shpaw415/mui-lite/Modal";
import Paper from "@shpaw415/mui-lite/Paper";
import Popover from "@shpaw415/mui-lite/Popover";
import Popper from "@shpaw415/mui-lite/Popper";
import Rating from "@shpaw415/mui-lite/Rating";
import Stack from "@shpaw415/mui-lite/Stack";
import Stepper, {
	Step,
	StepContent,
	StepLabel,
} from "@shpaw415/mui-lite/Stepper";
import Tabs, { Tab } from "@shpaw415/mui-lite/Tabs";
import Typography from "@shpaw415/mui-lite/Typography";
import { type ReactNode, useRef, useState } from "react";
import { Demo } from "../Demo";

function Icon({ children }: { children: ReactNode }) {
	return (
		<span style={{ fontSize: 24, lineHeight: 1 }} aria-hidden>
			{children}
		</span>
	);
}

export function BottomNavigationDemo() {
	const [value, setValue] = useState(0);
	return (
		<Demo>
			<div style={{ width: "100%", maxWidth: 400 }}>
				<BottomNavigation
					showLabels
					value={value}
					onChange={(_e, v) => setValue(v)}
				>
					<BottomNavigationAction label="Recents" icon={<Icon>R</Icon>} />
					<BottomNavigationAction label="Favorites" icon={<Icon>F</Icon>} />
					<BottomNavigationAction label="Nearby" icon={<Icon>N</Icon>} />
				</BottomNavigation>
			</div>
		</Demo>
	);
}

export function CollapseDemo() {
	const [open, setOpen] = useState(true);
	return (
		<Demo>
			<div style={{ width: "100%" }}>
				<Button onClick={() => setOpen((o) => !o)} variant="outlined">
					Toggle
				</Button>
				<Collapse in={open} style={{ marginTop: 12 }}>
					<Paper elevation={1} style={{ padding: 16 }}>
						Collapsible content. Supports in / open, orientation, and timeout.
					</Paper>
				</Collapse>
			</div>
		</Demo>
	);
}

const itemData = [
	{
		img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
		title: "Breakfast",
	},
	{
		img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
		title: "Burger",
	},
	{
		img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
		title: "Camera",
	},
	{
		img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
		title: "Coffee",
	},
];

export function ImageListDemo() {
	return (
		<Demo>
			<ImageList
				cols={2}
				rowHeight={140}
				gap={8}
				style={{ width: "100%", maxHeight: 320 }}
			>
				{itemData.map((item) => (
					<ImageListItem key={item.img}>
						<img
							src={item.img + "?w=280&h=140&fit=crop&auto=format"}
							alt={item.title}
							loading="lazy"
						/>
						<ImageListItemBar title={item.title} />
					</ImageListItem>
				))}
			</ImageList>
		</Demo>
	);
}

export function MobileStepperDemo() {
	const [active, setActive] = useState(0);
	const max = 5;
	return (
		<Demo>
			<div style={{ width: "100%", maxWidth: 400 }}>
				<MobileStepper
					variant="dots"
					steps={max}
					position="static"
					activeStep={active}
					nextButton={
						<Button
							size="small"
							onClick={() => setActive((s) => Math.min(s + 1, max - 1))}
							disabled={active === max - 1}
						>
							Next
						</Button>
					}
					backButton={
						<Button
							size="small"
							onClick={() => setActive((s) => Math.max(s - 1, 0))}
							disabled={active === 0}
						>
							Back
						</Button>
					}
				/>
				<div style={{ marginTop: 16 }}>
					<MobileStepper
						variant="text"
						steps={max}
						position="static"
						activeStep={active}
						nextButton={<span />}
						backButton={<span />}
					/>
				</div>
				<div style={{ marginTop: 16 }}>
					<MobileStepper
						variant="progress"
						steps={max}
						position="static"
						activeStep={active}
						nextButton={<span />}
						backButton={<span />}
					/>
				</div>
			</div>
		</Demo>
	);
}

export function ModalDemo() {
	const [open, setOpen] = useState(false);
	return (
		<Demo>
			<Button variant="contained" onClick={() => setOpen(true)}>
				Open modal
			</Button>
			<Modal open={open} onClose={() => setOpen(false)}>
				<Paper elevation={24} style={{ padding: 24, minWidth: 280 }}>
					<h3 style={{ marginTop: 0 }}>Modal title</h3>
					<p>Press Escape or click the backdrop to close.</p>
					<Button onClick={() => setOpen(false)}>Close</Button>
				</Paper>
			</Modal>
		</Demo>
	);
}

export function PopoverDemo() {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLButtonElement | null>(null);
	return (
		<Demo>
			<Button
				ref={ref as any}
				variant="contained"
				onClick={() => setOpen(true)}
			>
				Open Popover
			</Button>
			<Popover
				open={open}
				anchorEl={() => ref.current}
				onClose={() => setOpen(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
			>
				<div style={{ padding: 16, maxWidth: 280 }}>
					<Typography>The content of the Popover.</Typography>
				</div>
			</Popover>
		</Demo>
	);
}

export function PopperDemo() {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLButtonElement | null>(null);
	return (
		<Demo>
			<Button
				ref={ref as any}
				variant="outlined"
				onClick={() => setOpen((o) => !o)}
			>
				Toggle Popper
			</Button>
			<Popper open={open} anchorEl={() => ref.current} placement="bottom-start">
				<Paper elevation={3} style={{ padding: 12 }}>
					Lightweight positioned layer (no Floating UI).
				</Paper>
			</Popper>
		</Demo>
	);
}

export function RatingDemo() {
	const [value, setValue] = useState<number | null>(2);
	return (
		<Demo>
			<Stack spacing={1}>
				<Rating name="demo" value={value} onChange={(_e, v) => setValue(v)} />
				<Typography>{value !== null ? String(value) : "null"}</Typography>
				<Rating name="read" value={4} readOnly />
				<Rating name="disabled" value={3} disabled />
				<Rating name="sizes" defaultValue={2} size="small" />
				<Rating name="sizes2" defaultValue={2} size="large" />
			</Stack>
		</Demo>
	);
}

export function StepperDemo() {
	const [active, setActive] = useState(0);
	const steps = ["Select campaign", "Create ad group", "Create ad"];
	return (
		<Demo>
			<div style={{ width: "100%" }}>
				<Stepper activeStep={active}>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				<div style={{ marginTop: 16, display: "flex", gap: 8 }}>
					<Button
						disabled={active === 0}
						onClick={() => setActive((s) => s - 1)}
						variant="outlined"
					>
						Back
					</Button>
					<Button
						onClick={() => setActive((s) => Math.min(s + 1, steps.length))}
						variant="contained"
					>
						{active >= steps.length - 1 ? "Finish" : "Next"}
					</Button>
				</div>
			</div>
		</Demo>
	);
}

export function TabsDemo() {
	const [value, setValue] = useState(0);
	return (
		<Demo>
			<div style={{ width: "100%" }}>
				<Tabs value={value} onChange={(_e, v) => setValue(v)}>
					<Tab label="Item One" />
					<Tab label="Item Two" />
					<Tab label="Item Three" />
				</Tabs>
				<Box sx={{ padding: 16 }}>Panel {value + 1}</Box>
			</div>
		</Demo>
	);
}

export { FormControlLabelDemo } from "./FormControlLabelDemo";
export { SxDemo } from "./SxDemo";
export {
	AppBarDemo,
	BreadcrumbsDemo,
	ButtonBaseDemo,
	ButtonDemo,
	CardDemo,
	ContainerDemo,
	FormControlDemo,
	GridDemo,
	LinkDemo,
	NativeSelectDemo,
	StackDemo,
	TableDemo,
} from "./StaticDemos";

export {
	TypographyDemo,
	PaperDemo,
	DividerDemo,
	AlertDemo,
	AvatarDemo,
	BadgeDemo,
	ChipDemo,
	IconButtonDemo,
	FabDemo,
	SkeletonDemo,
	ProgressDemo,
	SwitchDemo,
	CheckBoxDemo,
	RadioDemo,
	SliderDemo,
	TextFieldDemo,
	SelectDemo,
	AutoCompleteDemo,
	ToggleDemo,
	ListDemo,
	AccordionDemo,
	DialogDemo,
	DrawerDemo,
	MenuDemo,
	SnackbarDemo,
	BackdropDemo,
	PaginationDemo,
	TooltipDemo,
	SpeedDialDemo,
} from "./MissingDemos";

export {
	InputBaseDemo,
	InputVariantsDemo,
	InputLabelDemo,
	InputAdornmentDemo,
	FormLabelDemo,
	FormHelperTextDemo,
	FormGroupDemo,
	ClickAwayListenerDemo,
	CssBaselineDemo,
	TablePaginationDemo,
	LocaleDemo,
} from "./ExtrasDemos";

export function BoxDemo() {
	return (
		<Demo>
			<Box
				Element="section"
				sx={{
					padding: 16,
					borderRadius: 8,
					backgroundColor: { "bg-primary": "main" },
					color: { "text-main": "dark" },
				}}
			>
				Themed box content
			</Box>
		</Demo>
	);
}

export function HomeButtonsDemo() {
	return (
		<Demo title="Button + Stack">
			<Stack direction="row" spacing={1}>
				<Button variant="contained">Contained</Button>
				<Button variant="outlined">Outlined</Button>
				<Button variant="text">Text</Button>
			</Stack>
		</Demo>
	);
}
