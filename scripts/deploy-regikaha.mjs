import { spawnSync } from "node:child_process";

const steps = [
  ["npm", ["run", "build"]],
  ["npx", ["wrangler", "d1", "migrations", "apply", "regikaha-db", "--remote"]],
  ["npx", ["wrangler", "pages", "deploy", "out", "--project-name", "regikaha", "--branch", "main"]],
];

for (const [command, args] of steps) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status) process.exit(result.status || 1);
}
