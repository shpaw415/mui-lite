#!/usr/bin/env node
/**
 * Build @shpaw415/mui-lite for npm:
 * 1. Emit JS + .d.ts via tsc
 * 2. Copy CSS assets into dist/style
 */
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

console.log("Cleaning dist/…");
rmSync(dist, { recursive: true, force: true });

console.log("Compiling TypeScript (JS + declarations)…");
const tsc = spawnSync("bunx", ["tsc", "-p", "tsconfig.build.json"], {
	cwd: root,
	stdio: "inherit",
});
if (tsc.status !== 0) {
	process.exit(tsc.status ?? 1);
}

console.log("Copying styles…");
const styleSrc = join(root, "style");
const styleDest = join(dist, "style");
mkdirSync(styleDest, { recursive: true });
cpSync(styleSrc, styleDest, { recursive: true });

console.log("Build complete → packages/mui-lite/dist");
