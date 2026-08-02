# mui-lite

Lightweight Material Design components for React 19. MUI-like APIs without Emotion or the full MUI runtime — plain CSS classes, CSS variables, and an `sx` prop.

**Package:** `@shpaw415/mui-lite` · **Runtime:** React 19 · **Module:** ESM · **Compatible with** [Bunext](https://github.com/bunpmjs/bunext)

---

## Install

```bash
bun add @shpaw415/mui-lite
# or
npm i @shpaw415/mui-lite
```

**Peer dependencies:** `react` ^19, `react-dom` ^19

**Dependencies:** `clsx`, `css-color-converter`, `@material-design-icons/svg`

Published builds include compiled ESM JavaScript and TypeScript declaration files (`.d.ts`).

---

## Quick start

```tsx
import "@shpaw415/mui-lite/style.css";
import { ThemeProvider, DefaultTheme } from "@shpaw415/mui-lite/theme";
import Button from "@shpaw415/mui-lite/Button";

export default function App() {
  return (
    <ThemeProvider theme={DefaultTheme}>
      <Button variant="contained" color="primary">
        Material UI Button
      </Button>
    </ThemeProvider>
  );
}
```

Wrap your tree in `ThemeProvider`. Import the stylesheet once at the app root.

---

## Package exports

| Import path | Resolves to (published) |
| --- | --- |
| `@shpaw415/mui-lite/<Component>` | `dist/mui/<Component>/index.js` + `.d.ts` |
| `@shpaw415/mui-lite/style.css` | bundled component CSS entry |
| `@shpaw415/mui-lite/theme` | theme provider, hooks, tokens |
| `@shpaw415/mui-lite/utils` | shared hooks and helpers |

Examples:

```ts
import Button, { ButtonGroup } from "@shpaw415/mui-lite/Button";
import TextField from "@shpaw415/mui-lite/TextField";
import { ThemeProvider, DefaultTheme, useTheme } from "@shpaw415/mui-lite/theme";
import { useClickAwayListener } from "@shpaw415/mui-lite/utils";
```

---

## Project structure

```
mui-lite/
├── common/                 # Shared runtime
│   ├── theme/              # ThemeProvider, sx, CSS variables, breakpoints
│   ├── utils.tsx           # Hooks, portals, color helpers, SlotProps
│   ├── ripple.tsx          # Material ripple effect
│   └── swipe.ts
├── mui/                    # Components (one folder each)
│   ├── Accordion/
│   ├── Alert/
│   ├── AutoComplete/
│   ├── Avatar/
│   ├── Backdrop/
│   ├── Badge/
│   ├── Box/
│   ├── Button/             # + ButtonGroup
│   ├── CheckBox/
│   ├── Chip/
│   ├── Dialog/             # + Title, Content, Actions
│   ├── Divider/
│   ├── Drawer/
│   ├── FloatingActionButton/
│   ├── IconButton/
│   ├── InputBase/
│   ├── List/               # + ListItem*, Collapse, ListSubheader
│   ├── Menu/
│   ├── Pagination/         # + TablePagination
│   ├── Paper/
│   ├── Progress/           # CircularProgress, LinearProgress
│   ├── Radio/
│   ├── Select/
│   ├── Skeleton/
│   ├── Slider/
│   ├── Snackbar/           # + SnackbarContent
│   ├── SpeedDial/          # + SpeedDialAction
│   ├── Switch/
│   ├── TextField/
│   ├── Toggle/             # ToggleButton, ToggleButtonGroup
│   ├── ToolTip/
│   ├── Typography/
│   └── locale/             # 59 locales + useLanguages
└── style/
    ├── mui-style.css       # Public CSS entry
    └── components/         # Per-component stylesheets
```

---

## Components

### Inputs

| Component | Import | Highlights |
| --- | --- | --- |
| **Button** | `Button` | `contained` / `outlined` / `text`, sizes, colors, ripple |
| **ButtonGroup** | `{ ButtonGroup }` from `Button` | Shared variant/size via props override |
| **IconButton** | `IconButton` | Icon-only press target with ripple |
| **FAB** | `FloatingActionButton` | Floating action button |
| **TextField** | `TextField` | Labeled text input |
| **InputBase** | `InputBase` | Unstyled base input |
| **Select** | `Select` | Dropdown select |
| **AutoComplete** | `AutoComplete` | Filterable options, keyboard nav, `SlotProps` |
| **CheckBox** | `CheckBox` | Checkbox control |
| **Radio** | `Radio` | Radio control |
| **Switch** | `Switch` | On/off switch |
| **Slider** | `Slider` | Range / value slider |
| **ToggleButton** | `Toggle` | Toggle + `ToggleButtonGroup` |

### Data display

| Component | Import | Highlights |
| --- | --- | --- |
| **Typography** | `Typography` | Text variants |
| **Avatar** | `Avatar` | Image / initials + `AvatarGroup` |
| **Badge** | `Badge` | Notification badge |
| **Chip** | `Chip` | Compact tag |
| **Divider** | `Divider` | Horizontal / vertical rule |
| **List** | `{ List, ListItem, ... }` | Dense lists, icons, collapse |
| **Skeleton** | `Skeleton` | Loading placeholders |
| **Tooltip** | `ToolTip` | Hover / focus hints |
| **TablePagination** | `{ TablePagination }` from `Pagination` | Rows-per-page UI |

### Feedback

| Component | Import | Highlights |
| --- | --- | --- |
| **Alert** | `Alert` | Severity banners |
| **Snackbar** | `Snackbar` | Transient messages + `SnackbarContent` |
| **Backdrop** | `Backdrop` | Dimmed overlay |
| **CircularProgress** / **LinearProgress** | `{ CircularProgress, LinearProgress }` from `Progress` | Indeterminate / determinate |

### Surfaces & layout

| Component | Import | Highlights |
| --- | --- | --- |
| **Box** | `Box` | Polymorphic layout primitive |
| **Paper** | `Paper` | Elevated surface |
| **Accordion** | `Accordion` | Summary / details / actions |
| **Dialog** | `Dialog` | Modal, drag, fullscreen, slide/fade |
| **Drawer** | `Drawer` | Side panel |
| **Menu** | `Menu` | Popup menu |
| **Pagination** | `Pagination` | Page controls (localized) |
| **SpeedDial** | `SpeedDial` | FAB speed dial + actions |

APIs intentionally track `@mui/material` where practical. Some props differ for SSR, slots, or lighter internals.

---

## Theming

### Provider

```tsx
import { ThemeProvider, DefaultTheme, type MuiTheme } from "@shpaw415/mui-lite/theme";

const theme: MuiTheme = {
  ...DefaultTheme,
  theme: "dark",       // "light" | "dark"
  locale: "enUS",
};

<ThemeProvider theme={theme} WrapperElement="div">
  {children}
</ThemeProvider>
```

`ThemeProvider`:

- Injects CSS variables (`--bg-primary`, `--text-main`, …) on a wrapper
- Supplies light/dark/main tokens for each color role
- Wraps a media-query context for responsive `sx`
- Accepts `sx`, `className`, and a custom `WrapperElement` (default `"main"`)

### Color tokens

Background: `bg-primary`, `bg-secondary`, `bg-error`, `bg-success`, `bg-warning`, `bg-main`, `bg-surface`  
Text: `text-primary`, `text-secondary`, `text-error`, `text-success`, `text-warning`, `text-info`, `text-main`  

Each token has `light`, `dark`, and `main` shades.

### Hooks

```tsx
import { useTheme, useSystemTheme, SystemTheme } from "@shpaw415/mui-lite/theme";

const theme = useTheme();                 // current MuiTheme
const [system, setSystem] = useSystemTheme(); // tracks prefers-color-scheme
const initial = SystemTheme();            // one-shot system preference
```

### `sx` prop

Most components accept `sx` — CSS properties plus breakpoint and theme color shortcuts:

```tsx
<Box
  sx={{
    padding: 16,
    backgroundColor: { "bg-surface": "theme" },
    color: { "text-main": "theme" },
    md: { padding: 24 },
    lg: { display: "flex", gap: 12 },
  }}
/>
```

Breakpoints (min-width): `xs` 0 · `sm` 600 · `md` 900 · `lg` 1200 · `xl` 1536

### Class naming

Styles use BEM-like classes generated by `useClassNames`:

```
MUI_Button
MUI_Button_contained
MUI_Button_primary
MUI_Button_primary_contained
```

Override or extend via `className` or the component CSS under `style/components/`.

### z-index scale

| Layer | Value |
| --- | --- |
| mobileStepper | 1000 |
| fab / speedDial | 1050 |
| appBar | 1100 |
| drawer | 1200 |
| modal | 1300 |
| snackbar | 1400 |
| tooltip | 1500 |

---

## Localization

59 locales ship under `mui/locale` (e.g. `enUS`, `frFR`, `deDE`, `jaJP`, `zhCN`, `ptBR`, …). Set `theme.locale` on `MuiTheme`. Components such as `Pagination` and `Alert` read strings via `useLanguages`.

```tsx
import { DefaultTheme } from "@shpaw415/mui-lite/theme";
import { frFR } from "@shpaw415/mui-lite/locale"; // if re-exported path available

const theme = { ...DefaultTheme, locale: "frFR" as const };
```

---

## Utilities (`@shpaw415/mui-lite/utils`)

Useful hooks and helpers:

| API | Purpose |
| --- | --- |
| `useClickAwayListener` | Close menus/dialogs on outside click |
| `useMediaQuery` | Current breakpoint key |
| `useMuiRef` | Stable ref helper |
| `useColorOverRide` / `useValueOverRide` | CSS variable overrides |
| `PropsOverRideProvider` | Cascade props (e.g. ButtonGroup → Button) |
| `useDragElement` | Drag positioning (Dialog) |
| `usePreventScroll` | Lock body scroll |
| `useIsOutOfViewport` | IntersectionObserver helper |
| `MuiSSRPortal` | Portal into the theme wrapper (SSR-safe) |
| `ColorToRGBArray`, `Darker`, `Lighter` | Color math |

---

## Styling entry

```ts
import "@shpaw415/mui-lite/style.css";
```

That file imports fonts and every component stylesheet (vanilla CSS only). You can also import individual files from `style/components/` if you tree-shake CSS manually.

---

## Design notes

- **No Emotion / styled-components** — styles are static CSS + runtime CSS variables.
- **Client components** — interactive pieces mark `"use client"` for RSC hosts.
- **SSR-aware** — theme defaults avoid hydration mismatch; portals target the theme wrapper.
- **Deep imports** — import only the components you use.
- **MUI familiarity** — variants, colors, sizes, and composition patterns stay close to Material UI.

---

## Roadmap / known gaps

- **ToolTip** — complete feature set; consider Popover API
- **ButtonGroup** — finalize edge cases
- **SpeedDial** — transitions for custom icons
- **Collapse** stub at `mui/Collapse` — use `Collapse` from `List` for now

---

## License

See repository license file.
```