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

function HeartIcon({ filled }: { filled?: boolean }) {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			aria-hidden
			focusable="false"
		>
			{filled ? (
				<path
					fill="currentColor"
					d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
				/>
			) : (
				<path
					fill="currentColor"
					d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
				/>
			)}
		</svg>
	);
}

function ThumbIcon({ filled }: { filled?: boolean }) {
	// Material-style thumb_up (filled) / thumb_up_off_alt-style outline
	return (
		<svg
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			aria-hidden
			focusable="false"
		>
			<path
				fill="currentColor"
				d={
					filled
						? "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
						: "M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9l-3 7H9V9zM1 9h4v12H1z"
				}
			/>
		</svg>
	);
}

export function RatingDemo() {
	const [value, setValue] = useState<number | null>(2.5);
	const [hover, setHover] = useState(-1);
	const [hearts, setHearts] = useState<number | null>(4);
	return (
		<>
			<Demo title="Interactive (half-star)">
				<Stack spacing={1}>
					<Typography variant="body2" color="textSecondary">
						Hover to preview · click to set · default step is ½ star
					</Typography>
					<Rating
						name="demo"
						value={value}
						precision={0.5}
						onChange={(_e, v) => setValue(v)}
						onChangeActive={(_e, v) => setHover(v)}
					/>
					<Typography>
						{hover !== -1
							? `Preview: ${hover}`
							: value !== null
								? `Value: ${value}`
								: "Unset"}
					</Typography>
				</Stack>
			</Demo>

			<Demo title="Colors">
				<Stack spacing={1.5}>
					{(
						[
							{ label: "Default (gold)", color: undefined },
							{ label: "Primary", color: "primary" as const },
							{ label: "Secondary", color: "secondary" as const },
							{ label: "Error", color: "error" as const },
							{ label: "Warning", color: "warning" as const },
							{ label: "Success", color: "success" as const },
						] as const
					).map(({ label, color }) => (
						<Stack
							key={label}
							direction="row"
							spacing={2}
							style={{ alignItems: "center" }}
						>
							<Typography variant="caption" style={{ width: 110 }}>
								{label}
							</Typography>
							<Rating
								name={`color-${label}`}
								defaultValue={3.5}
								precision={0.5}
								color={color}
								readOnly
							/>
						</Stack>
					))}
					<Stack direction="row" spacing={2} style={{ alignItems: "center" }}>
						<Typography variant="caption" style={{ width: 110 }}>
							Custom hex
						</Typography>
						<Rating
							name="color-override"
							defaultValue={4}
							precision={0.5}
							colorOverRide="#9c27b0"
							readOnly
						/>
					</Stack>
				</Stack>
			</Demo>

			<Demo title="Custom icons">
				<Stack spacing={1.5}>
					<Stack direction="row" spacing={2} style={{ alignItems: "center" }}>
						<Typography variant="caption" style={{ width: 110 }}>
							Hearts
						</Typography>
						<Rating
							name="hearts"
							value={hearts}
							precision={1}
							color="error"
							icon={<HeartIcon filled />}
							emptyIcon={<HeartIcon />}
							onChange={(_e, v) => setHearts(v)}
						/>
					</Stack>
					<Stack direction="row" spacing={2} style={{ alignItems: "center" }}>
						<Typography variant="caption" style={{ width: 110 }}>
							Thumbs
						</Typography>
						<Rating
							name="thumbs"
							defaultValue={3}
							max={5}
							precision={1}
							color="primary"
							icon={<ThumbIcon filled />}
							emptyIcon={<ThumbIcon />}
						/>
					</Stack>
					<Stack direction="row" spacing={2} style={{ alignItems: "center" }}>
						<Typography variant="caption" style={{ width: 110 }}>
							Emoji
						</Typography>
						<Rating
							name="emoji"
							defaultValue={4}
							precision={1}
							icon={<span style={{ fontSize: "1em", lineHeight: 1 }}>🔥</span>}
							emptyIcon={
								<span style={{ fontSize: "1em", lineHeight: 1, opacity: 0.35 }}>
									🔥
								</span>
							}
						/>
					</Stack>
				</Stack>
			</Demo>

			<Demo title="States & sizes">
				<Stack spacing={1.5}>
					<Stack direction="row" spacing={2} style={{ alignItems: "center" }}>
						<Typography variant="caption" style={{ width: 72 }}>
							Read-only
						</Typography>
						<Rating name="read" value={4.5} precision={0.5} readOnly />
					</Stack>
					<Stack direction="row" spacing={2} style={{ alignItems: "center" }}>
						<Typography variant="caption" style={{ width: 72 }}>
							Disabled
						</Typography>
						<Rating name="disabled" value={3} precision={0.5} disabled />
					</Stack>
					<Stack direction="row" spacing={2} style={{ alignItems: "center" }}>
						<Typography variant="caption" style={{ width: 72 }}>
							Whole
						</Typography>
						<Rating name="whole" defaultValue={3} precision={1} />
					</Stack>
					<Stack direction="row" spacing={2} style={{ alignItems: "center" }}>
						<Typography variant="caption" style={{ width: 72 }}>
							Sizes
						</Typography>
						<Rating name="sm" defaultValue={2.5} precision={0.5} size="small" />
						<Rating name="md" defaultValue={2.5} precision={0.5} size="medium" />
						<Rating name="lg" defaultValue={2.5} precision={0.5} size="large" />
					</Stack>
				</Stack>
			</Demo>
		</>
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
