/**
 * Documentation sidebar navigation.
 * Keep in sync with pages under src/pages/docs/.
 */

export type DocsNavLink = {
	label: string;
	href: string;
};

export type DocsNavGroup = {
	title: string;
	items: DocsNavLink[];
};

export const docsGuideLinks: DocsNavLink[] = [
	{ label: "Getting started", href: "/docs/getting-started" },
	{ label: "Theming", href: "/docs/theming" },
	{ label: "sx prop", href: "/docs/sx" },
	{ label: "Components overview", href: "/docs/components" },
];

export const docsComponentGroups: DocsNavGroup[] = [
	{
		title: "Foundations",
		items: [
			{ label: "Button", href: "/docs/components/button" },
			{ label: "ButtonBase", href: "/docs/components/button-base" },
			{ label: "IconButton", href: "/docs/components/icon-button" },
			{ label: "FAB", href: "/docs/components/fab" },
			{ label: "Box", href: "/docs/components/box" },
			{ label: "Stack", href: "/docs/components/stack" },
			{ label: "Container", href: "/docs/components/container" },
			{ label: "Grid", href: "/docs/components/grid" },
			{ label: "Typography", href: "/docs/components/typography" },
			{ label: "Paper", href: "/docs/components/paper" },
			{ label: "Divider", href: "/docs/components/divider" },
			{ label: "Collapse", href: "/docs/components/collapse" },
			{ label: "Modal", href: "/docs/components/modal" },
			{ label: "Backdrop", href: "/docs/components/backdrop" },
		],
	},
	{
		title: "Layout & shell",
		items: [
			{ label: "AppBar", href: "/docs/components/app-bar" },
			{ label: "Card", href: "/docs/components/card" },
			{ label: "Accordion", href: "/docs/components/accordion" },
			{ label: "Drawer", href: "/docs/components/drawer" },
			{ label: "Link", href: "/docs/components/link" },
			{ label: "Breadcrumbs", href: "/docs/components/breadcrumbs" },
		],
	},
	{
		title: "Inputs & forms",
		items: [
			{ label: "TextField", href: "/docs/components/text-field" },
			{ label: "InputBase", href: "/docs/components/input-base" },
			{ label: "Input", href: "/docs/components/input" },
			{ label: "InputLabel", href: "/docs/components/input-label" },
			{ label: "InputAdornment", href: "/docs/components/input-adornment" },
			{ label: "FormControl", href: "/docs/components/form-control" },
			{ label: "FormLabel", href: "/docs/components/form-label" },
			{ label: "FormHelperText", href: "/docs/components/form-helper-text" },
			{ label: "FormGroup", href: "/docs/components/form-group" },
			{ label: "FormControlLabel", href: "/docs/components/form-control-label" },
			{ label: "Select", href: "/docs/components/select" },
			{ label: "NativeSelect", href: "/docs/components/native-select" },
			{ label: "AutoComplete", href: "/docs/components/autocomplete" },
			{ label: "CheckBox", href: "/docs/components/checkbox" },
			{ label: "Radio", href: "/docs/components/radio" },
			{ label: "Switch", href: "/docs/components/switch" },
			{ label: "Slider", href: "/docs/components/slider" },
			{ label: "Toggle", href: "/docs/components/toggle" },
		],
	},
	{
		title: "Data display",
		items: [
			{ label: "List", href: "/docs/components/list" },
			{ label: "Table", href: "/docs/components/table" },
			{ label: "TablePagination", href: "/docs/components/table-pagination" },
			{ label: "Avatar", href: "/docs/components/avatar" },
			{ label: "Badge", href: "/docs/components/badge" },
			{ label: "Chip", href: "/docs/components/chip" },
			{ label: "Tooltip", href: "/docs/components/tooltip" },
			{ label: "Skeleton", href: "/docs/components/skeleton" },
			{ label: "ImageList", href: "/docs/components/image-list" },
			{ label: "Rating", href: "/docs/components/rating" },
			{ label: "Pagination", href: "/docs/components/pagination" },
		],
	},
	{
		title: "Feedback",
		items: [
			{ label: "Alert", href: "/docs/components/alert" },
			{ label: "Snackbar", href: "/docs/components/snackbar" },
			{ label: "Dialog", href: "/docs/components/dialog" },
			{ label: "Progress", href: "/docs/components/progress" },
		],
	},
	{
		title: "Navigation",
		items: [
			{ label: "Tabs", href: "/docs/components/tabs" },
			{ label: "Stepper", href: "/docs/components/stepper" },
			{ label: "MobileStepper", href: "/docs/components/mobile-stepper" },
			{ label: "BottomNavigation", href: "/docs/components/bottom-navigation" },
			{ label: "Menu", href: "/docs/components/menu" },
			{ label: "SpeedDial", href: "/docs/components/speed-dial" },
		],
	},
	{
		title: "Overlays",
		items: [
			{ label: "Popover", href: "/docs/components/popover" },
			{ label: "Popper", href: "/docs/components/popper" },
		],
	},
	{
		title: "Utilities",
		items: [
			{ label: "ClickAwayListener", href: "/docs/components/click-away-listener" },
			{ label: "CssBaseline", href: "/docs/components/css-baseline" },
			{ label: "Locale", href: "/docs/components/locale" },
		],
	},
];

/** Flat list of all component hrefs (for search / mobile). */
export function allDocsNavLinks(): DocsNavLink[] {
	return [
		...docsGuideLinks,
		...docsComponentGroups.flatMap((g) => g.items),
	];
}
