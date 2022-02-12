import path from "path";

import { getFilePaths } from "./utils";

export interface NextConfig {
  pagesPath: string;
  pageExtensions: string[];
}

export const getNextJsPageExtensions = async (rootPath: string): Promise<string[]> => {
  const defaultExtensions = [".tsx"];
  const configPath = path.join(rootPath, "next.config.js");

  const config = await import(configPath);

  if (!config) return defaultExtensions;

  return Array.isArray(config.pageExtensions) ? config.pageExtensions : defaultExtensions;
};

export const getNextJsPages = async (config: NextConfig): Promise<string[]> => {
  const { pagesPath, pageExtensions } = config;

  const pages = await getFilePaths(pagesPath, pageExtensions);

  const extPattern = new RegExp(pageExtensions.join("|").replace(/\./g, "\\."));
  const pagePattern = new RegExp(`(?:${extPattern.source})$`);
  const paramPattern = new RegExp(`^\[(.+)\](?:${extPattern.source})$`);

  return pages.flatMap((page) => {
    if (!page.match(pagePattern)) return [];

    const newPagePath = page
      .replace(pagesPath, "")
      .split("/")
      .map((node) => {
        const result = node.match(paramPattern);

        return !result ? node.replace(extPattern, "") : `{${result[1]}}`;
      })
      .join("/");

    return [newPagePath];
  });
};
