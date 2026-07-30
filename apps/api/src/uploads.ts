import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
export const uploadsRoot = path.join(root, "data", "uploads");

export function ensureUploadsDir(...parts: string[]) {
  const dir = path.join(uploadsRoot, ...parts);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function safeAttachmentName(name: string) {
  const base = path.basename(name).replace(/[^\w.\-()+ ]+/g, "_").slice(0, 180);
  if (!base || base === "." || base === "..") return "attachment.bin";
  return base;
}

export function absoluteAttachmentPath(relativePath: string) {
  const normalized = path.normalize(relativePath).replace(/^([/\\])+/, "");
  if (normalized.includes("..")) {
    throw new Error("Invalid attachment path");
  }
  const abs = path.resolve(uploadsRoot, normalized);
  const rootResolved = path.resolve(uploadsRoot);
  if (abs !== rootResolved && !abs.startsWith(rootResolved + path.sep)) {
    throw new Error("Invalid attachment path");
  }
  return abs;
}

export function removeAttachmentFile(relativePath: string | null | undefined) {
  if (!relativePath) return;
  try {
    fs.unlinkSync(absoluteAttachmentPath(relativePath));
  } catch {
    // ignore missing files
  }
}
