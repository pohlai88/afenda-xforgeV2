#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (entry.name !== "package.json") {
      continue;
    }

    const original = fs.readFileSync(fullPath, "utf8");
    const updated = original.replaceAll(
      /"@repo\/([^"]+)": "\*"/g,
      '"@repo/$1": "workspace:*"'
    );

    if (updated !== original) {
      fs.writeFileSync(fullPath, updated);
      console.log(`updated ${path.relative(root, fullPath)}`);
    }
  }
}

walk(root);
