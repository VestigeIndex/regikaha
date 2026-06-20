import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const config = readFileSync(join(root, "wrangler.jsonc"), "utf8");
const requiredFlags = [
  '"COST_MODE": "survival"',
  '"ENABLE_HEAVY_FEATURES": "false"',
  '"ENABLE_AI_FEATURES": "false"',
  '"ENABLE_VIDEO_UPLOADS": "false"',
  '"ENABLE_DOCUMENT_UPLOADS": "false"',
  '"AUTO_UNLOCK_LEADS": "false"',
];
const missingFlags = requiredFlags.filter((flag) => !config.includes(flag));
const forbiddenNames = /(^|[\\/])(uploads?|backups?)([\\/]|$)/i;
const forbidden = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (["node_modules", ".git", ".next", "out", ".wrangler"].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (forbiddenNames.test(path)) forbidden.push(path);
    if (entry.isDirectory()) walk(path);
  }
}
walk(root);

for (const script of ["scripts/analyze-bundle.mjs", "scripts/analyze-workers.mjs"]) {
  const result = spawnSync(process.execPath, [script], { cwd: root, stdio: "inherit" });
  if (result.status) process.exitCode = 1;
}
if (missingFlags.length) {
  console.error(`Missing survival flags: ${missingFlags.join(", ")}`);
  process.exitCode = 1;
}
if (forbidden.length) {
  console.error(`Forbidden upload/backup paths in repository: ${forbidden.join(", ")}`);
  process.exitCode = 1;
}
console.log(`Survival flags: ${missingFlags.length ? "FAIL" : "OK"}; repository uploads/backups: ${forbidden.length}`);
