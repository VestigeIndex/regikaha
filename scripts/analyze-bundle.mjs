import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const target = existsSync(join(root, "out")) ? join(root, "out") : join(root, "public");
const files = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else files.push({ path, size: statSync(path).size });
  }
}

walk(target);
const total = files.reduce((sum, file) => sum + file.size, 0);
const large = files.filter((file) => file.size > 1024 * 1024).sort((a, b) => b.size - a.size);
const videos = files.filter((file) => new Set([".mp4", ".mov", ".avi", ".webm", ".mkv"]).has(extname(file.path).toLowerCase()));
const publicImages = files.filter((file) => /\.(png|jpe?g|webp|gif|avif)$/i.test(file.path) && file.size > 2 * 1024 * 1024);
const hashes = new Map();
for (const file of files.filter((item) => item.size > 4096)) {
  const hash = createHash("sha256").update(readFileSync(file.path)).digest("hex");
  hashes.set(hash, [...(hashes.get(hash) || []), file]);
}
const duplicates = [...hashes.values()].filter((group) => group.length > 1);

console.log(`Bundle: ${files.length} files, ${(total / 1024 / 1024).toFixed(1)} MB (${relative(root, target)})`);
console.log(`Files >1 MB: ${large.length}; videos: ${videos.length}; images >2 MB: ${publicImages.length}; duplicate groups: ${duplicates.length}`);
for (const file of large.slice(0, 15)) console.log(`  LARGE ${(file.size / 1024 / 1024).toFixed(1)} MB ${relative(root, file.path)}`);
if (videos.length || publicImages.length) process.exitCode = 1;
