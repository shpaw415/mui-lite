# mui-lite monorepo

Lightweight Material Design components for React 19.

## Packages

| Path | Description |
| --- | --- |
| [`packages/mui-lite`](./packages/mui-lite) | `@shpaw415/mui-lite` component library |
| [`apps/docs`](./apps/docs) | Documentation site (Frame Master + MDX) |

## Scripts

```bash
bun install
bun test                 # unit tests
bun run docs:dev         # docs site
bun run typecheck
```

## Library quick start

```bash
bun add @shpaw415/mui-lite
```

```tsx
import "@shpaw415/mui-lite/style.css";
import { ThemeProvider, DefaultTheme } from "@shpaw415/mui-lite/theme";
import Button from "@shpaw415/mui-lite/Button";

export default function App() {
  return (
    <ThemeProvider theme={DefaultTheme}>
      <Button variant="contained">Hello</Button>
    </ThemeProvider>
  );
}
```

See [packages/mui-lite/README.md](./packages/mui-lite/README.md) for the full API overview.
