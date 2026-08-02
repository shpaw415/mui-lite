#!/usr/bin/env node
/**
 * Build @shpaw415/mui-lite for npm:
 * 1. Emit JS + .d.ts via tsc
 * 2. Rewrite relative imports to include .js (Node ESM)
 * 3. Copy CSS assets into dist/style
 */
import {
	cpSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
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

/**
 * tsc with moduleResolution "bundler" leaves extensionless relative imports.
 * Node ESM requires explicit .js — rewrite after emit.
 */
function walkJsFiles(dir, out = []) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		const st = statSync(p);
		if (st.isDirectory()) walkJsFiles(p, out);
		else if (name.endsWith(".js") && !name.endsWith(".js.map")) out.push(p);
	}
	return out;
}

function resolveImportPath(fromFile, spec) {
	if (!spec.startsWith(".")) return null;
	if (/\.(js|json|css|mjs|cjs)$/.test(spec)) return null;

	const base = join(dirname(fromFile), spec);
	if (existsSync(`${base}.js`)) return `${spec}.js`;
	if (existsSync(join(base, "index.js"))) {
		return spec.endsWith("/") ? `${spec}index.js` : `${spec}/index.js`;
	}
	// Declaration-only edge: prefer .js suffix anyway if sibling .d.ts exists
	if (existsSync(`${base}.d.ts`)) return `${spec}.js`;
	if (existsSync(join(base, "index.d.ts"))) {
		return spec.endsWith("/") ? `${spec}index.js` : `${spec}/index.js`;
	}
	return `${spec}.js`;
}

function rewriteRelativeImports(file) {
	const src = readFileSync(file, "utf8");
	const next = src.replace(
		/(from\s+|import\s*\(\s*|export\s+\*\s+from\s+)(["'])(\.[^"']+)\2/g,
		(match, prefix, quote, spec) => {
			const resolved = resolveImportPath(file, spec);
			if (!resolved || resolved === spec) return match;
			return `${prefix}${quote}${resolved}${quote}`;
		},
	);
	if (next !== src) writeFileSync(file, next);
}

console.log("Adding .js extensions to relative imports…");
let rewritten = 0;
for (const file of walkJsFiles(dist)) {
	const before = readFileSync(file, "utf8");
	rewriteRelativeImports(file);
	if (readFileSync(file, "utf8") !== before) rewritten++;
}
console.log(`  rewrote ${rewritten} files`);

console.log("Copying styles…");
const styleSrc = join(root, "style");
const styleDest = join(dist, "style");
mkdirSync(styleDest, { recursive: true });
cpSync(styleSrc, styleDest, { recursive: true });

console.log("Build complete → packages/mui-lite/dist");
