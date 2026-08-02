/**
 * One-shot script: inject use-case JSDoc (@example) above each component's main export.
 * Run: bun scripts/inject-component-jsdocs.mjs
 * Idempotent: skips files that already have "@example" immediately above the target symbol.
 */
import fs from "node:fs";
import path from "node:path";

const MUI = path.resolve(import.meta.dirname, "../mui");

/** @type {Record<string, { symbol: string | RegExp; summary: string; examples: { title: string; code: string }[] }>} */
const DOCS = {
	Accordion: {
		symbol: "export default function Accordion",
		summary:
			"Expandable section for FAQ, settings groups, and progressive disclosure.",
		examples: [
			{
				title: "FAQ item",
				code: `<Accordion>
  <AccordionSummary>Shipping</AccordionSummary>
  <AccordionDetails>We ship worldwide in 3–5 days.</AccordionDetails>
</Accordion>`,
			},
		],
	},
	Alert: {
		symbol: "export default function Alert",
		summary: "Persistent inline feedback for success, warning, error, or info.",
		examples: [
			{
				title: "Form validation error",
				code: `<Alert severity="error">Please fix the highlighted fields.</Alert>`,
			},
		],
	},
	AppBar: {
		symbol: "export default function AppBar",
		summary: "Top application chrome for titles, navigation, and actions.",
		examples: [
			{
				title: "App header",
				code: `<AppBar position="static">
  <Toolbar>
    <Typography variant="h6">Dashboard</Typography>
  </Toolbar>
</AppBar>`,
			},
		],
	},
	AutoComplete: {
		symbol: /export default function AutoComplete/,
		summary: "Filterable option list for search, tags, and typeahead fields.",
		examples: [
			{
				title: "Country search",
				code: `<AutoComplete
  options={countries}
  onSelect={setCountry}
/>`,
			},
		],
	},
	Avatar: {
		symbol: "export default function Avatar",
		summary: "User image or initials for profiles, comments, and lists.",
		examples: [
			{
				title: "User chip",
				code: `<Avatar src={user.photo} alt={user.name} />`,
			},
		],
	},
	Backdrop: {
		symbol: "export default function Backdrop",
		summary: "Dims the page behind modals or while a blocking action runs.",
		examples: [
			{
				title: "Loading overlay",
				code: `<Backdrop open={loading} />`,
			},
		],
	},
	Badge: {
		symbol: "export default function Badge",
		summary: "Notification counts and status dots on icons or avatars.",
		examples: [
			{
				title: "Inbox count",
				code: `<Badge badgeContent={4} color="error">
  <MailIcon />
</Badge>`,
			},
		],
	},
	BottomNavigation: {
		symbol: "export default function BottomNavigation",
		summary: "Mobile primary navigation across a few top-level destinations.",
		examples: [
			{
				title: "Tab bar",
				code: `<BottomNavigation value={tab} onChange={setTab}>
  <BottomNavigationAction label="Home" icon={<HomeIcon />} />
  <BottomNavigationAction label="Search" icon={<SearchIcon />} />
</BottomNavigation>`,
			},
		],
	},
	Box: {
		symbol: /export default function Box/,
		summary: "Layout primitive with sx for spacing, color, and responsive styles.",
		examples: [
			{
				title: "Padded section",
				code: `<Box sx={{ p: 2, bgcolor: "background.paper" }}>Content</Box>`,
			},
		],
	},
	Breadcrumbs: {
		symbol: "export default function Breadcrumbs",
		summary: "Hierarchy path for nested pages and multi-level navigation.",
		examples: [
			{
				title: "Folder trail",
				code: `<Breadcrumbs>
  <Link href="/">Home</Link>
  <Link href="/docs">Docs</Link>
  <Typography>Button</Typography>
</Breadcrumbs>`,
			},
		],
	},
	Button: {
		symbol: "function Button(",
		summary:
			"Primary call-to-action with Material variants, colors, sizes, and ripple.",
		examples: [
			{
				title: "Save / cancel",
				code: `<>
  <Button variant="contained" onClick={save}>Save</Button>
  <Button variant="text" onClick={cancel}>Cancel</Button>
</>`,
			},
		],
	},
	ButtonBase: {
		symbol: "export default function ButtonBase",
		summary: "Headless pressable surface for custom interactive elements.",
		examples: [
			{
				title: "Custom tile",
				code: `<ButtonBase onClick={select} sx={{ p: 2, borderRadius: 1 }}>
  Choose plan
</ButtonBase>`,
			},
		],
	},
	Card: {
		symbol: "export default function Card",
		summary: "Content tile for product, media, and summary surfaces.",
		examples: [
			{
				title: "Product card",
				code: `<Card>
  <CardMedia image={img} title="Shoes" />
  <CardContent>
    <Typography variant="h6">Runner Pro</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Buy</Button>
  </CardActions>
</Card>`,
			},
		],
	},
	CheckBox: {
		symbol: "export default function CheckBox",
		summary: "Multi-select boolean control for forms and filters.",
		examples: [
			{
				title: "Accept terms",
				code: `<FormControlLabel control={<CheckBox />} label="I agree" />`,
			},
		],
	},
	Chip: {
		symbol: "export default function Chip",
		summary: "Compact tags for filters, categories, and removable selections.",
		examples: [
			{
				title: "Filter chip",
				code: `<Chip label="React" onDelete={clear} />`,
			},
		],
	},
	ClickAwayListener: {
		symbol: "export default function ClickAwayListener",
		summary: "Detects outside clicks to dismiss menus, popovers, and editors.",
		examples: [
			{
				title: "Close popover",
				code: `<ClickAwayListener onClickAway={() => setOpen(false)}>
  <div>{open && <Menu />}</div>
</ClickAwayListener>`,
			},
		],
	},
	Collapse: {
		symbol: "export default function Collapse",
		summary: "Animated show/hide for secondary content and expandable rows.",
		examples: [
			{
				title: "Expand details",
				code: `<Collapse open={expanded}>
  <Typography>More detail…</Typography>
</Collapse>`,
			},
		],
	},
	Container: {
		symbol: "export default function Container",
		summary: "Centered max-width page column for readable layouts.",
		examples: [
			{
				title: "Page body",
				code: `<Container maxWidth="md">
  <Typography variant="h4">Docs</Typography>
</Container>`,
			},
		],
	},
	CssBaseline: {
		symbol: "export default function CssBaseline",
		summary: "Global reset and theme background for consistent baselines.",
		examples: [
			{
				title: "App root",
				code: `<>
  <CssBaseline />
  <App />
</>`,
			},
		],
	},
	Dialog: {
		symbol: "export default function Dialog",
		summary: "Modal dialog for confirmations, forms, and focused tasks.",
		examples: [
			{
				title: "Confirm delete",
				code: `<Dialog open={open} onClose={onClose}>
  <DialogTitle>Delete item?</DialogTitle>
  <DialogContent>This cannot be undone.</DialogContent>
  <DialogActions>
    <Button onClick={onClose}>Cancel</Button>
    <Button color="error" onClick={remove}>Delete</Button>
  </DialogActions>
</Dialog>`,
			},
		],
	},
	Divider: {
		symbol: "export default function Divider",
		summary: "Visual separator between sections, list items, or toolbars.",
		examples: [
			{
				title: "Section break",
				code: `<>
  <Typography>Profile</Typography>
  <Divider />
  <Typography>Settings</Typography>
</>`,
			},
		],
	},
	Drawer: {
		symbol: "export default function Drawer",
		summary: "Side panel for navigation, filters, and mobile menus.",
		examples: [
			{
				title: "Nav drawer",
				code: `<Drawer open={open} onClose={onClose}>
  <List>
    <ListItemButton>Home</ListItemButton>
  </List>
</Drawer>`,
			},
		],
	},
	FilledInput: {
		symbol: /export default|export function FilledInput|FilledInput/,
		// re-export file may be thin — handled separately
		summary: "Filled variant text input surface (FormControl composition).",
		examples: [
			{
				title: "With label",
				code: `<FormControl variant="filled">
  <InputLabel>Email</InputLabel>
  <FilledInput />
</FormControl>`,
			},
		],
	},
	FloatingActionButton: {
		symbol: "export default function FAB",
		summary: "Primary floating action for create / compose on a screen.",
		examples: [
			{
				title: "Compose",
				code: `<FAB color="primary" aria-label="add" onClick={compose}>
  <AddIcon />
</FAB>`,
			},
		],
	},
	FormControl: {
		symbol: "export default function FormControl",
		summary: "Field context for label, input, helper text, error, and size.",
		examples: [
			{
				title: "Composed field",
				code: `<FormControl error>
  <InputLabel>Email</InputLabel>
  <OutlinedInput />
  <FormHelperText>Required</FormHelperText>
</FormControl>`,
			},
		],
	},
	FormControlLabel: {
		symbol: "export default function FormControlLabel",
		summary: "Pairs a control (checkbox, radio, switch) with an accessible label.",
		examples: [
			{
				title: "Labeled switch",
				code: `<FormControlLabel control={<Switch />} label="Notifications" />`,
			},
		],
	},
	FormGroup: {
		symbol: "export default function FormGroup",
		summary: "Groups related checkboxes or switches in a form section.",
		examples: [
			{
				title: "Permission set",
				code: `<FormGroup>
  <FormControlLabel control={<CheckBox />} label="Read" />
  <FormControlLabel control={<CheckBox />} label="Write" />
</FormGroup>`,
			},
		],
	},
	FormHelperText: {
		symbol: "export default function FormHelperText",
		summary: "Helper or error text under a FormControl field.",
		examples: [
			{
				title: "Validation message",
				code: `<FormHelperText error>Invalid email</FormHelperText>`,
			},
		],
	},
	FormLabel: {
		symbol: "export default function FormLabel",
		summary: "Label for a group of controls (radios, checkboxes) or a fieldset.",
		examples: [
			{
				title: "Radio group label",
				code: `<FormLabel>Shipping method</FormLabel>
<RadioGroup>{/* radios */}</RadioGroup>`,
			},
		],
	},
	Grid: {
		symbol: "export default function Grid",
		summary: "Responsive multi-column layout with 12-column sizing.",
		examples: [
			{
				title: "Two-column form",
				code: `<Grid container spacing={2}>
  <Grid size={6}><TextField label="First" fullWidth /></Grid>
  <Grid size={6}><TextField label="Last" fullWidth /></Grid>
</Grid>`,
			},
		],
	},
	IconButton: {
		symbol: "function IconButton(",
		summary: "Icon-only action for toolbars, lists, and compact UIs.",
		examples: [
			{
				title: "Close",
				code: `<IconButton aria-label="close" onClick={onClose}>
  <CloseIcon />
</IconButton>`,
			},
		],
	},
	ImageList: {
		symbol: "export default function ImageList",
		summary: "Responsive media gallery grid (masonry-style image collections).",
		examples: [
			{
				title: "Photo grid",
				code: `<ImageList cols={3} gap={8}>
  {photos.map((p) => (
    <ImageListItem key={p}>
      <img src={p} alt="" loading="lazy" />
    </ImageListItem>
  ))}
</ImageList>`,
			},
		],
	},
	Input: {
		symbol: "export default function Input",
		summary: "Standard underline input for FormControl composition.",
		examples: [
			{
				title: "Amount field",
				code: `<FormControl variant="standard">
  <InputLabel>Amount</InputLabel>
  <Input startAdornment={<InputAdornment position="start">$</InputAdornment>} />
</FormControl>`,
			},
		],
	},
	InputAdornment: {
		symbol: "export default function InputAdornment",
		summary: "Start/end adornment (icons, units) inside text inputs.",
		examples: [
			{
				title: "Currency prefix",
				code: `<InputAdornment position="start">$</InputAdornment>`,
			},
		],
	},
	InputBase: {
		symbol: "export default function InputBase",
		summary: "Bare input primitive for custom field surfaces.",
		examples: [
			{
				title: "Search box core",
				code: `<InputBase placeholder="Search…" fullWidth />`,
			},
		],
	},
	InputLabel: {
		symbol: "export default function InputLabel",
		summary: "Floating / shrinking label for FormControl inputs.",
		examples: [
			{
				title: "Labeled outlined field",
				code: `<FormControl>
  <InputLabel>Email</InputLabel>
  <OutlinedInput />
</FormControl>`,
			},
		],
	},
	Link: {
		symbol: "export default function Link",
		summary: "Themed text link with underline and color variants.",
		examples: [
			{
				title: "Inline docs link",
				code: `<Typography>
  See the <Link href="/docs">documentation</Link>.
</Typography>`,
			},
		],
	},
	List: {
		symbol: "export function List(",
		summary: "Structured rows for navigation, settings, and selection lists.",
		examples: [
			{
				title: "Settings list",
				code: `<List>
  <ListItemButton>
    <ListItemText primary="Account" secondary="Email & security" />
  </ListItemButton>
</List>`,
			},
		],
	},
	Menu: {
		symbol: "export default function Menu",
		summary: "Anchored action menu for overflow and contextual actions.",
		examples: [
			{
				title: "Row actions",
				code: `<Menu open={open} anchorEl={btnRef} onClose={onClose}>
  <ListItemButton onClick={edit}>Edit</ListItemButton>
  <ListItemButton onClick={remove}>Delete</ListItemButton>
</Menu>`,
			},
		],
	},
	MobileStepper: {
		symbol: /export default function MobileStepper|function MobileStepper/,
		summary: "Compact step indicator for carousels and mobile wizards.",
		examples: [
			{
				title: "Onboarding steps",
				code: `<MobileStepper
  steps={4}
  activeStep={step}
  nextButton={<Button onClick={next}>Next</Button>}
  backButton={<Button onClick={back}>Back</Button>}
/>`,
			},
		],
	},
	Modal: {
		symbol: "export default function Modal",
		summary: "Low-level blocking overlay primitive (prefer Dialog for most UIs).",
		examples: [
			{
				title: "Custom modal shell",
				code: `<Modal open={open} onClose={onClose}>
  <Box sx={{ p: 3, bgcolor: "background.paper" }}>Custom body</Box>
</Modal>`,
			},
		],
	},
	NativeSelect: {
		symbol: "export default function NativeSelect",
		summary: "Styled native <select> for simple option lists.",
		examples: [
			{
				title: "Page size",
				code: `<FormControl variant="standard">
  <InputLabel>Rows</InputLabel>
  <NativeSelect defaultValue={10}>
    <option value={10}>10</option>
    <option value={25}>25</option>
  </NativeSelect>
</FormControl>`,
			},
		],
	},
	OutlinedInput: {
		symbol: /export function OutlinedInput|OutlinedInput/,
		summary: "Outlined border input for FormControl composition.",
		examples: [
			{
				title: "Email field",
				code: `<FormControl>
  <InputLabel>Email</InputLabel>
  <OutlinedInput type="email" />
</FormControl>`,
			},
		],
	},
	Pagination: {
		symbol: /export default function Pagination|function Pagination/,
		summary: "Page controls for tables, search results, and lists.",
		examples: [
			{
				title: "Results paging",
				code: `<Pagination count={10} page={page} onChange={(_, p) => setPage(p)} />`,
			},
		],
	},
	Paper: {
		symbol: "export default function Paper",
		summary: "Elevated surface for cards, menus, and floating panels.",
		examples: [
			{
				title: "Panel",
				code: `<Paper elevation={2} sx={{ p: 2 }}>Dashboard widget</Paper>`,
			},
		],
	},
	Popover: {
		symbol: "export default function Popover",
		summary: "Anchored modal surface for pickers and lightweight overlays.",
		examples: [
			{
				title: "Color picker shell",
				code: `<Popover open={open} anchorEl={anchor} onClose={onClose}>
  <Box sx={{ p: 2 }}>Picker content</Box>
</Popover>`,
			},
		],
	},
	Popper: {
		symbol: /export default function Popper|function Popper/,
		summary: "Non-blocking positioned layer (tooltips, dropdowns without modal).",
		examples: [
			{
				title: "Anchored helper",
				code: `<Popper open={open} anchorEl={ref.current} placement="bottom-start">
  <Paper sx={{ p: 1 }}>Hint</Paper>
</Popper>`,
			},
		],
	},
	Progress: {
		symbol: "export function CircularProgress",
		summary: "Loading indicators (circular and linear) for async work.",
		examples: [
			{
				title: "Page loading",
				code: `<CircularProgress />
<LinearProgress variant="determinate" value={progress} />`,
			},
		],
	},
	Radio: {
		symbol: "export default function Radio",
		summary: "Single-select control within a radio group.",
		examples: [
			{
				title: "Plan choice",
				code: `<FormControlLabel value="pro" control={<Radio />} label="Pro" />`,
			},
		],
	},
	Rating: {
		symbol: "export default function Rating",
		summary: "Star score input and display for reviews.",
		examples: [
			{
				title: "Product review",
				code: `<Rating name="quality" defaultValue={4} onChange={setScore} />`,
			},
		],
	},
	Select: {
		symbol: "function Select(",
		summary: "Custom dropdown select with Material field styling and menu.",
		examples: [
			{
				title: "Fruit picker",
				code: `<Select name="fruit" label="Fruit" defaultValue="apple">
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
</Select>`,
			},
		],
	},
	Skeleton: {
		symbol: "export default function Skeleton",
		summary: "Placeholder shimmer while content loads.",
		examples: [
			{
				title: "Card loading",
				code: `<Skeleton variant="rectangular" height={120} />
<Skeleton width="60%" />`,
			},
		],
	},
	Slider: {
		symbol: "function Slider(",
		summary: "Continuous or discrete numeric control (single value or range).",
		examples: [
			{
				title: "Volume with tooltip",
				code: `<Slider toolTip valueLabelDisplay="on" defaultValue={40} aria-label="Volume" />`,
			},
			{
				title: "Price range",
				code: `<Slider defaultValue={[25, 75]} toolTip valueLabelDisplay="auto" />`,
			},
		],
	},
	Snackbar: {
		symbol: "export default function Snackbar",
		summary: "Transient toast for success, errors, and short notifications.",
		examples: [
			{
				title: "Saved toast",
				code: `<Snackbar
  open={open}
  autoHideDuration={3000}
  onClose={onClose}
  message="Saved"
/>`,
			},
		],
	},
	SpeedDial: {
		symbol: "export default function SpeedDial",
		summary: "Fan-out FAB for multiple related primary actions.",
		examples: [
			{
				title: "Create actions",
				code: `<SpeedDial ariaLabel="Create" icon={<AddIcon />}>
  <SpeedDialAction icon={<FileIcon />} tooltipTitle="File" onClick={newFile} />
</SpeedDial>`,
			},
		],
	},
	Stack: {
		symbol: /export default function Stack|function Stack/,
		summary: "One-axis flex layout with consistent spacing.",
		examples: [
			{
				title: "Form column",
				code: `<Stack spacing={2}>
  <TextField label="Email" />
  <Button variant="contained">Submit</Button>
</Stack>`,
			},
		],
	},
	Stepper: {
		symbol: "export default function Stepper",
		summary: "Multi-step wizard progress for checkout and onboarding.",
		examples: [
			{
				title: "Checkout steps",
				code: `<Stepper activeStep={1}>
  <Step><StepLabel>Cart</StepLabel></Step>
  <Step><StepLabel>Shipping</StepLabel></Step>
  <Step><StepLabel>Pay</StepLabel></Step>
</Stepper>`,
			},
		],
	},
	Switch: {
		symbol: "function Switch(",
		summary: "Binary on/off toggle for settings and preferences.",
		examples: [
			{
				title: "Dark mode",
				code: `<FormControlLabel control={<Switch checked={dark} onChange={toggle} />} label="Dark mode" />`,
			},
		],
	},
	Tab: {
		symbol: /export function Tab\(|export default function Tab/,
		summary: "Single tab control used inside Tabs.",
		examples: [
			{
				title: "Tab item",
				code: `<Tab label="Overview" value="overview" />`,
			},
		],
	},
	Table: {
		symbol: "export default function Table",
		summary: "Tabular data with head, body, sorting, and pagination helpers.",
		examples: [
			{
				title: "Simple table",
				code: `<TableContainer>
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell align="right">Calories</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>{/* rows */}</TableBody>
  </Table>
</TableContainer>`,
			},
		],
	},
	Tabs: {
		symbol: "export default function Tabs",
		summary: "Peer view switcher for related panels on one page.",
		examples: [
			{
				title: "Profile sections",
				code: `<Tabs value={tab} onChange={(_, v) => setTab(v)}>
  <Tab label="Profile" value="profile" />
  <Tab label="Security" value="security" />
</Tabs>`,
			},
		],
	},
	TextField: {
		symbol: "function TextField(",
		summary: "Labeled text input (standard / outlined / filled) with helper text.",
		examples: [
			{
				title: "Login field",
				code: `<TextField label="Email" variant="outlined" fullWidth />`,
			},
		],
	},
	Toggle: {
		symbol: "export default function ToggleButton",
		summary: "Toggle button / group for exclusive or multi options (alignment, view mode).",
		examples: [
			{
				title: "Text align",
				code: `<ToggleButtonGroup value={align} exclusive onChange={setAlign}>
  <ToggleButton value="left">Left</ToggleButton>
  <ToggleButton value="center">Center</ToggleButton>
</ToggleButtonGroup>`,
			},
		],
	},
	Toolbar: {
		symbol: /export default function Toolbar|function Toolbar/,
		summary: "Horizontal bar inside AppBar for title and actions.",
		examples: [
			{
				title: "App toolbar",
				code: `<Toolbar>
  <Typography variant="h6" sx={{ flex: 1 }}>App</Typography>
  <IconButton aria-label="account"><AccountIcon /></IconButton>
</Toolbar>`,
			},
		],
	},
	ToolTip: {
		symbol: "export default function ToolTip",
		summary: "Hover/focus hint for icons, truncated text, and controls.",
		examples: [
			{
				title: "Icon hint",
				code: `<ToolTip title="Delete">
  <IconButton aria-label="delete"><DeleteIcon /></IconButton>
</ToolTip>`,
			},
		],
	},
	Tooltip: {
		symbol: /export \{ default|export \{ default as ToolTip|/,
		// re-export file — inject file-level comment
		summary: "Alias re-export of ToolTip.",
		examples: [
			{
				title: "Import alias",
				code: `import Tooltip from "@shpaw415/mui-lite/Tooltip";`,
			},
		],
	},
	Typography: {
		symbol: /export default function Typography/,
		summary: "Theme-aware text styles (h1–body, captions, overlines).",
		examples: [
			{
				title: "Page title",
				code: `<Typography variant="h4" component="h1">Dashboard</Typography>`,
			},
		],
	},
	// Thin re-exports / special cases
	OutlinedInput: {
		// same file as Input — skip separate
		symbol: "NEVER_MATCH_OUTLINED",
		summary: "",
		examples: [],
	},
	FilledInput: {
		symbol: "NEVER_MATCH_FILLED",
		summary: "",
		examples: [],
	},
};

function buildJsDoc({ summary, examples }) {
	const lines = ["/**", ` * ${summary}`, " *"];
	for (const ex of examples) {
		lines.push(` * @example ${ex.title}`);
		lines.push(" * ```tsx");
		for (const codeLine of ex.code.trim().split("\n")) {
			lines.push(` * ${codeLine}`);
		}
		lines.push(" * ```");
		lines.push(" *");
	}
	// drop trailing empty " *"
	if (lines[lines.length - 1] === " *") lines.pop();
	lines.push(" */");
	return lines.join("\n") + "\n";
}

function findSymbolIndex(source, symbol) {
	if (typeof symbol === "string") {
		if (symbol.startsWith("NEVER_MATCH")) return -1;
		return source.indexOf(symbol);
	}
	const m = source.match(symbol);
	return m?.index ?? -1;
}

function alreadyDocumented(source, idx) {
	const before = source.slice(Math.max(0, idx - 400), idx);
	return /@example\b/.test(before) && /\*\/\s*$/.test(before.trimEnd().slice(-20)) ||
		/\/\*\*[\s\S]*?@example[\s\S]*?\*\/\s*$/.test(before);
}

let updated = 0;
let skipped = 0;
let missing = 0;

const dirs = fs.readdirSync(MUI, { withFileTypes: true }).filter((d) => d.isDirectory());

for (const dir of dirs) {
	const name = dir.name;
	if (name === "locale") continue;
	const file = path.join(MUI, name, "index.tsx");
	if (!fs.existsSync(file)) continue;

	const meta = DOCS[name];
	if (!meta || !meta.summary) {
		// try generate generic from name if not in map
		if (!meta) {
			console.warn("no docs map:", name);
			missing++;
		}
		continue;
	}

	let source = fs.readFileSync(file, "utf8");
	const idx = findSymbolIndex(source, meta.symbol);
	if (idx < 0) {
		console.warn("symbol not found:", name, meta.symbol);
		missing++;
		continue;
	}

	if (alreadyDocumented(source, idx)) {
		skipped++;
		continue;
	}

	// Don't double-insert if previous block exists without @example — still insert if no /** immediately before
	const pre = source.slice(Math.max(0, idx - 80), idx);
	if (/\/\*\*[\s\S]*?\*\/\s*$/.test(pre) && /@example/.test(pre)) {
		skipped++;
		continue;
	}

	const jsdoc = buildJsDoc(meta);
	source = source.slice(0, idx) + jsdoc + source.slice(idx);
	fs.writeFileSync(file, source);
	updated++;
	console.log("updated", name);
}

// Input.tsx also exports OutlinedInput / FilledInput — document them if missing
const inputFile = path.join(MUI, "Input", "index.tsx");
if (fs.existsSync(inputFile)) {
	let src = fs.readFileSync(inputFile, "utf8");
	const extras = [
		{
			symbol: "export function OutlinedInput",
			summary: "Outlined border input for FormControl composition.",
			examples: [
				{
					title: "Email field",
					code: `<FormControl>
  <InputLabel>Email</InputLabel>
  <OutlinedInput type="email" />
</FormControl>`,
				},
			],
		},
		{
			symbol: "export function FilledInput",
			summary: "Filled variant text input surface (FormControl composition).",
			examples: [
				{
					title: "With label",
					code: `<FormControl variant="filled">
  <InputLabel>Email</InputLabel>
  <FilledInput />
</FormControl>`,
				},
			],
		},
	];
	for (const meta of extras) {
		const idx = src.indexOf(meta.symbol);
		if (idx < 0) continue;
		if (alreadyDocumented(src, idx)) continue;
		src = src.slice(0, idx) + buildJsDoc(meta) + src.slice(idx);
		console.log("updated Input →", meta.symbol);
		updated++;
	}
	fs.writeFileSync(inputFile, src);
}

// FilledInput thin re-export file
const filledPath = path.join(MUI, "FilledInput", "index.tsx");
if (fs.existsSync(filledPath)) {
	let src = fs.readFileSync(filledPath, "utf8");
	if (!src.includes("@example")) {
		const jsdoc = buildJsDoc({
			summary: "Re-export of FilledInput from Input.",
			examples: [
				{
					title: "Import",
					code: `import FilledInput from "@shpaw415/mui-lite/FilledInput";`,
				},
			],
		});
		src = jsdoc + src;
		fs.writeFileSync(filledPath, src);
		updated++;
		console.log("updated FilledInput re-export");
	}
}

const outlinedPath = path.join(MUI, "OutlinedInput", "index.tsx");
if (fs.existsSync(outlinedPath)) {
	let src = fs.readFileSync(outlinedPath, "utf8");
	if (!src.includes("@example")) {
		const jsdoc = buildJsDoc({
			summary: "Re-export of OutlinedInput from Input.",
			examples: [
				{
					title: "Import",
					code: `import OutlinedInput from "@shpaw415/mui-lite/OutlinedInput";`,
				},
			],
		});
		src = jsdoc + src;
		fs.writeFileSync(outlinedPath, src);
		updated++;
		console.log("updated OutlinedInput re-export");
	}
}

// Tooltip re-export
const tooltipPath = path.join(MUI, "Tooltip", "index.tsx");
if (fs.existsSync(tooltipPath)) {
	let src = fs.readFileSync(tooltipPath, "utf8");
	if (!src.includes("@example")) {
		const jsdoc = buildJsDoc({
			summary: "Alias re-export of ToolTip (hover/focus hints).",
			examples: [
				{
					title: "Icon hint",
					code: `import Tooltip from "@shpaw415/mui-lite/Tooltip";

<Tooltip title="Delete">
  <IconButton aria-label="delete"><DeleteIcon /></IconButton>
</Tooltip>`,
				},
			],
		});
		src = jsdoc + src;
		fs.writeFileSync(tooltipPath, src);
		updated++;
		console.log("updated Tooltip re-export");
	}
}

// MobileStepper / Pagination / Progress / Stack / Toolbar / Popper if missed
console.log({ updated, skipped, missing });
