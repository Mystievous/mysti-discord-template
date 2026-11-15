import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Imports the default export of every .ts/.js file in `dir`, keeping only
 * those that pass `isValid`. Invalid files are skipped with a warning.
 */
export async function loadDefaultExports<T>(
  dir: string,
  isValid: (value: unknown) => value is T,
): Promise<T[]> {
  const results: T[] = [];
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw: unknown = await import(pathToFileURL(filePath).href);
    const hasDefaultExport =
      typeof raw === "object" && raw !== null && "default" in raw;
    const value = hasDefaultExport ? raw.default : undefined;

    if (isValid(value)) {
      results.push(value);
    } else {
      console.warn(
        `[WARNING] ${filePath} has no valid default export; skipped.`,
      );
    }
  }

  return results;
}
