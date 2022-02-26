import path from "path";

import { generateNextLinkType } from "./link";
import { formatNextJsPages, getNextJsPageExtensions, getNextJsPagePaths } from "./utils";

import { getExistsPath, getFilePaths } from "../../helpers/utils";
import { GenerateTargetTypes } from "../../types";

const defaultPages = ["//${string}", "http://${string}", "https://${string}"];

export const generateNextTypes = async (target: GenerateTargetTypes) => {
  const cwd = process.cwd();

  const [pagesPath, pageExtensions] = await Promise.all([
    getExistsPath([path.join(cwd, "pages"), path.join(cwd, "src/pages")]).catch(() => {
      return Promise.reject(new Error("Not Found Next.js pages folder"));
    }),
    getNextJsPageExtensions(cwd).catch(() => [".jsx", ".tsx"]),
  ]);

  const pages = await getFilePaths(pagesPath, pageExtensions);

  const formatedPages = formatNextJsPages({ pages, pagesPath, pageExtensions });
  const pageHelpers = formatedPages.map((page) => page.replace(/index$/, ""));

  const paths = [defaultPages, getNextJsPagePaths(formatedPages)].flat().map((v) => `\`${v}\``);
  const helpers = [defaultPages, pageHelpers].flat().map((v) => `"path:${v}"`);

  return `
    declare module "magipoka/next" {
      export type NextPagesType = ${paths.join("|")} | ${helpers.join("|")}
    }

    ${["next", "next/link"].includes(target) ? generateNextLinkType() : ""}
  `;
};
