import path from "path";

import { generateNextLinkType } from "./link";
import { formatNextJsPages, getNextJsPageExtensions, getNextJsPagePaths } from "./utils";

import { getExistsPath, getFilePaths } from "../../helpers/utils";
import { GenerateTargetTypes, MagipokaStrictConfig } from "../../types";

const defaultPages = ["//${string}", "http://${string}", "https://${string}"];

export const allowNextJsTargets: GenerateTargetTypes[] = ["next", "next/link"];

type TargetKeys = typeof allowNextJsTargets[number];
type NextJsGenerateTarget = Record<TargetKeys, boolean>;

const getNextJsTargets = (target: string[]): NextJsGenerateTarget => {
  const dict = {} as NextJsGenerateTarget;

  return target.includes("next")
    ? allowNextJsTargets.reduce((flags, key) => ({ ...flags, [key]: true }), dict)
    : allowNextJsTargets.reduce((flags, key) => ({ ...flags, [key]: target.includes(key) }), dict);
};

export const generateNextTypes = async (config: MagipokaStrictConfig) => {
  const cwd = process.cwd();
  const targetFlags = getNextJsTargets(config.target);

  const [pagesPath, pageExtensions] = await Promise.all([
    getExistsPath([path.join(cwd, "pages"), path.join(cwd, "src/pages")]).catch(() => {
      return Promise.reject(new Error("Not Found Next.js pages folder"));
    }),
    getNextJsPageExtensions(cwd).catch(() => [".jsx", ".tsx"]),
  ]);

  const pages = await getFilePaths(pagesPath, pageExtensions);

  const formatedPages = formatNextJsPages({ pages, pagesPath, pageExtensions });

  const paths = [defaultPages, getNextJsPagePaths(formatedPages)].flat().map((v) => `\`${v}\``);

  // prettier-ignore
  const typeHelpers = config.typeHelper 
    ? `| ${[defaultPages, formatedPages].flat().map((v) => `"path:${v}"`).join("|")}`
    : "";

  return `
    declare module "magipoka/next" {
      export type NextPagesType = ${paths.join("|")} ${typeHelpers}
    }

    ${targetFlags["next/link"] ? generateNextLinkType() : ""}
  `;
};
