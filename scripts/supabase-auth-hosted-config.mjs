import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const hostedConfigPath = path.join(root, "supabase", "auth.hosted.toml");

export function readHostedConfigText() {
  if (!fs.existsSync(hostedConfigPath)) {
    return "";
  }

  return fs.readFileSync(hostedConfigPath, "utf8");
}

export function hostedSection(text, header) {
  const start = text.indexOf(header);
  if (start === -1) {
    return "";
  }

  const rest = text.slice(start + header.length);
  const next = rest.search(/^\[[^\]]+\]/m);
  return next === -1 ? rest : rest.slice(0, next);
}
