import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const functionRoot = join(root, "functions");
const files = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (extname(path) === ".ts") files.push(path);
  }
}
walk(functionRoot);

const config = readFileSync(join(root, "wrangler.jsonc"), "utf8");
const endpoints = files.filter((file) => /onRequest(Get|Post|Put|Patch|Delete)/.test(readFileSync(file, "utf8")));
const turnstileRoutes = ["api/register.ts", "api/projects.ts", "api/b2b-projects.ts", "api/quote.ts", "api/contact.ts"];
const missingTurnstile = turnstileRoutes.filter((suffix) => {
  const file = files.find((item) => item.replaceAll("\\", "/").endsWith(suffix));
  return !file || !readFileSync(file, "utf8").includes("requireTurnstile");
});
const middleware = readFileSync(join(functionRoot, "api", "_middleware.ts"), "utf8");

console.log(`Pages Functions endpoints: ${endpoints.length}`);
for (const endpoint of endpoints) console.log(`  ${relative(root, endpoint)}`);
console.log(`Bindings: D1=${config.includes('"d1_databases"')} R2=${config.includes('"r2_buckets"') && !config.includes('// "r2_buckets"')} Turnstile=${config.includes('"REGIKAHA_ENABLE_TURNSTILE": "true"')}`);
console.log(`Global API rate guard: ${middleware.includes("rateLimitByIP")}`);
if (missingTurnstile.length) {
  console.error(`Missing Turnstile validation: ${missingTurnstile.join(", ")}`);
  process.exitCode = 1;
}
