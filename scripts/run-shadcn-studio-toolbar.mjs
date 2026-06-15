import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const configPath = join(root, "shadcn-studio.config.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const targetName = process.argv[2] ?? config.defaultTarget;
const target = config.targets[targetName];

if (!target) {
  console.error(
    `Unknown shadcn studio target "${targetName}". Available: ${Object.keys(config.targets).join(", ")}`
  );
  process.exit(1);
}

const args = [
  "shadcn-studio-extension-cli@latest",
  "-s",
  "-a",
  String(target.appPort),
  "-p",
  String(config.toolbarPort),
  "-w",
  root,
];

console.log(
  `Starting shadcn/studio toolbar on http://localhost:${config.toolbarPort} -> ${target.label} (port ${target.appPort})`
);
console.log(`shadcn CLI cwd: ${config.shadcnCwd}`);
console.log(
  "Ensure the target dev server is already running before using the toolbar."
);

const child = spawn("npx", args, {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
