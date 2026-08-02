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
bun run build            # compile @shpaw415/mui-lite (JS + .d.ts + CSS; needed for consumers of dist exports)
bun test                 # unit tests
bun run docs:dev         # docs site
bun run typecheck
```

## Publishing to npm

The library is published from GitHub Actions (manual workflow).

1. Add repository secret **`NPM_TOKEN`** (npm automation token with publish access to `@shpaw415`).
2. Open **Actions → Publish to npm → Run workflow**.
3. Optionally set a version bump (`patch` / `minor` / `major` or exact semver) and dist-tag.
4. Use **dry_run** first to pack without publishing.

Locally:

```bash
bun run build
cd packages/mui-lite && npm publish --access public
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
