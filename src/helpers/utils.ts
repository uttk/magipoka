import fs from "fs/promises";
import path from "path";

export const getExistsPath = (paths: string | string[]): Promise<string> => {
  paths = Array.isArray(paths) ? paths : [paths];
  return Promise.any<string>(paths.map((v) => fs.access(v).then(() => v)));
};

export const isSameExtension = (name: string, exts: string[]): boolean => {
  return !!name.match(new RegExp(`(?:${exts.join("|").replace(".", "\\.")})$`));
};

export const getPageFilePaths = async (
  root: string,
  pageExtensions: string[]
): Promise<string[]> => {
  const filePaths: string[] = [];
  const tasks: Promise<string[]>[] = [];

  const dirents = await fs.readdir(root, { withFileTypes: true });

  for (const child of dirents) {
    const folderPath = path.join(root, child.name);

    if (child.isFile()) {
      if (isSameExtension(child.name, pageExtensions)) {
        filePaths.push(folderPath);
      }
    } else if (child.isDirectory()) {
      tasks.push(getPageFilePaths(folderPath, pageExtensions));
    }
  }

  const childPaths = await Promise.all(tasks);

  filePaths.push(...childPaths.flat());

  return filePaths;
};