import { readdirSync, statSync } from "fs";
import { extname, join } from "path";

export async function getFiles(path: string) {
  const entries = readdirSync(path);

  let filePaths: string[] = [];

  for (const entry of entries) {
    const fullPath = join(path, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      const nestedCommands = await getFiles(fullPath);
      filePaths = filePaths.concat(nestedCommands);
    } else if ([".ts", ".js"].includes(extname(fullPath))) {
      filePaths.push(fullPath);
    }
  }
  return filePaths;
}
