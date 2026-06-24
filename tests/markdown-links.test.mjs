import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

function listMarkdownFiles(dir) {
  const output = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      output.push(...listMarkdownFiles(path));
    } else if (stat.isFile() && extname(path) === ".md") {
      output.push(path);
    }
  }
  return output;
}

test("local markdown links resolve inside the repository", () => {
  const failures = [];
  for (const file of listMarkdownFiles(root)) {
    const content = readFileSync(file, "utf8");
    for (const match of content.matchAll(markdownLinkPattern)) {
      const href = match[1];
      if (/^(https?:|mailto:|#)/.test(href)) continue;
      const target = href.split("#")[0];
      if (!target) continue;
      const resolved = resolve(dirname(file), target);
      if (!resolved.startsWith(root)) {
        failures.push(`${file}: link escapes repository: ${href}`);
      } else if (!existsSync(resolved)) {
        failures.push(`${file}: broken link: ${href}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});
