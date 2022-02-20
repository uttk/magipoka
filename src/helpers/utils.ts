import { constants } from "fs";
import fs from "fs/promises";
import path from "path";

export const isExistsPath = (path: string): Promise<boolean> => {
  return fs
    .access(path, constants.R_OK)
    .then(() => true)
    .catch(() => false);
};

export const getExistsPath = (paths: string | string[]): Promise<string> => {
  paths = Array.isArray(paths) ? paths : [paths];
  return Promise.any<string>(paths.map((v) => fs.access(v, constants.R_OK).then(() => v)));
};

export const isSameExtension = (name: string, exts: string[]): boolean => {
  return !!name.match(new RegExp(`(?:${exts.join("|").replace(".", "\\.")})$`));
};

export const getFilePaths = async (root: string, pageExtensions: string[]): Promise<string[]> => {
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
      tasks.push(getFilePaths(folderPath, pageExtensions));
    }
  }

  const childPaths = await Promise.all(tasks);

  filePaths.push(...childPaths.flat());

  return filePaths;
};
