import fs from "fs/promises";
import path from "path";

import { getNextJsPageExtensions } from "../helpers/nextjs";
import { getExistsPath, getPageFilePaths } from "../helpers/utils";

export const getPages = async (): Promise<string[]> => {
  const cwd = process.cwd();

  const [pagesPath, pageExtensions] = await Promise.all([
    getExistsPath([path.join(cwd, "pages"), path.join(cwd, "src", "pages")]),
    getNextJsPageExtensions(cwd),
  ]);

  const pages = await getPageFilePaths(pagesPath, pageExtensions);

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

export default async (): Promise<string> => {
  const pages = await getPages();

  const pageList = pages.join("|");

  const linkPath = "node_modules/next/dist/client/link.d.ts";
  const modulePath = path.resolve(process.cwd(), linkPath);

  const typeModule = await fs.readFile(modulePath, "utf-8");

  return `
      declare module "__next/link__" {
        ${typeModule}
      }

      declare module "next/link" {
        import Link from "__next/link__";

        type LinkType = typeof Link;
        type PageType = ${pageList};     
        
        type ExtendPageType<T> = { href: Exclude<T, string> | PageType };

        type InjectCustomType<A> = A extends [infer F, ...infer N]
          ? F extends { href: any }
            ? [Omit<F, "href"> & ExtendPageType<F["href"]>, ...InjectCustomType<N>]
            : [F, ...InjectCustomType<N>]
          : A;
      
        export default function CustomLink(...args: InjectCustomType<LinkArgs>): LinkReturn;
      }
    `;
};
