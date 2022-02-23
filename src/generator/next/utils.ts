import path from "path";

import { getFilePaths } from "../../helpers/utils";

export interface GenerateNextOption {
  pagesPath: string;
  pageExtensions: string[];
}

export const getNextJsPageExtensions = async (rootPath: string): Promise<string[]> => {
  const defaultExtensions = [".jsx", ".tsx"];
  const configPath = path.join(rootPath, "next.config.js");

  const config = await import(configPath);

  if (!config) return defaultExtensions;

  return Array.isArray(config.pageExtensions)
    ? config.pageExtensions.map((v: string) => `.${v}`)
    : defaultExtensions;
};

export const getNextJsPages = async (options: GenerateNextOption): Promise<string[]> => {
  const { pagesPath, pageExtensions } = options;

  const pages = await getFilePaths(pagesPath, pageExtensions);

  const extPattern = new RegExp(pageExtensions.join("|").replace(/\./g, "\\."));
  const pagePattern = new RegExp(`(?:${extPattern.source})$`);
  const paramPattern = /^\[([^\.]+)\]/;
  const catchAllPattern = /^\[(\.\.\.[^\.]+)\]/;

  const pageList: Record<string, boolean> = {};

  pages.forEach((page) => {
    if (!page.match(pagePattern)) return;
    if (path.basename(page).startsWith("_")) return;

    const newPages = page
      .replace(pagesPath, "")
      .split("/")
      .map((value) => {
        const name = value.replace(extPattern, "");

        if (value.length === 0 || name === "index") return "";
        if (value.match(paramPattern)) return "${string}";
        if (value.match(catchAllPattern)) return "${...string}";

        return name;
      });

    const len = newPages.length;
    const last = newPages[len - 1];
    const secondLast = newPages[len - 2];

    if (last === "${string}") newPages.push("");
    if (last === "${...string}") newPages[len - 1] = "${string}";
    if (last === "" && secondLast.length && secondLast !== "${string}") newPages.pop();

    pageList[newPages.join("/")] = true;
  });

  return Object.keys(pageList);
};
