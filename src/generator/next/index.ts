import path from "path";

import { generateNextLinkType } from "./link";
import { getNextJsPageExtensions, getNextJsPages } from "./utils";

import { getExistsPath } from "../../helpers/utils";

export interface NextTypesOptions {
  link: boolean;
}

const defaultPages = ["//${string}", "http://${string}", "https://${string}"];

export const generateNextTypes = async (options: NextTypesOptions) => {
  const cwd = process.cwd();

  const [pagesPath, pageExtensions] = await Promise.all([
    getExistsPath([path.join(cwd, "pages"), path.join(cwd, "src/pages")]).catch(() => {
      return Promise.reject(new Error("Not Found Next.js pages folder"));
    }),
    getNextJsPageExtensions(cwd).catch(() => [".jsx", ".tsx"]),
  ]);

  const pages = await getNextJsPages({ pagesPath, pageExtensions }).then((v) => {
    return defaultPages.concat(v);
  });

  const types = [];

  if (options.link) {
    types.push(generateNextLinkType());
  }

  return `
    declare module "magipoka/next" {
      export type NextPagesType = ${pages.map((v) => `\`${v}\``).join("|")}
    }

    ${types.join("\n")}
  `;
};
