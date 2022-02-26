import path from "path";

export const getNextJsPageExtensions = async (rootPath: string): Promise<string[]> => {
  const defaultExtensions = [".jsx", ".tsx"];
  const configPath = path.join(rootPath, "next.config.js");

  const config = await import(configPath);

  if (!config) return defaultExtensions;

  return Array.isArray(config.pageExtensions)
    ? config.pageExtensions.map((v: string) => `.${v}`)
    : defaultExtensions;
};

export const formatNextJsPages = ({
  pages,
  pagesPath,
  pageExtensions,
}: {
  pages: string[];
  pagesPath: string;
  pageExtensions: string[];
}): string[] => {
  const extPattern = new RegExp(pageExtensions.join("|").replace(/\./g, "\\."));
  const pagePattern = new RegExp(`(?:${extPattern.source})$`);

  return pages
    .filter((page) => {
      return !!page.match(pagePattern) && !path.basename(page).startsWith("_");
    })
    .map((page) => {
      return page.replace(pagesPath, "").replace(extPattern, "");
    });
};

export const getNextJsPagePaths = (pages: string[]): string[] => {
  const indexFilePattern = /index$/;
  const paramPattern = /\[([^\./]+)\]/g;
  const catchAllPattern = /\[(\.\.\.[^\.]+)\].*/;

  const pageList: Record<string, boolean> = {};

  pages.forEach((page) => {
    let newPage = page
      .replace(indexFilePattern, "")
      .replaceAll(paramPattern, "${string}")
      .replace(catchAllPattern, "${string}")
      .replace(/(?<=.+)\/$/, "");

    if (page.match(paramPattern)) {
      newPage += "/";
    }

    pageList[newPage] = true;
  });

  return Object.keys(pageList);
};
