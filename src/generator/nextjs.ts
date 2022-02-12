import fs from "fs/promises";
import path from "path";

import { getNextJsPageExtensions, getNextJsPages } from "../helpers/nextjs";
import { getExistsPath } from "../helpers/utils";

export default async (): Promise<string> => {
  const cwd = process.cwd();
  const modulePath = path.join(process.cwd(), "node_modules/next/dist/client/link.d.ts");

  const [pagesPath, pageExtensions, typeModule] = await Promise.all([
    getExistsPath([path.join(cwd, "pages"), path.join(cwd, "src/pages")]),
    getNextJsPageExtensions(cwd),
    fs.readFile(modulePath, "utf-8"),
  ]);

  const pages = await getNextJsPages({ pagesPath, pageExtensions });

  return `
      declare module "__next/link__" {
        ${typeModule}
      }

      declare module "next/link" {
        import Link from "__next/link__";

        type LinkType = typeof Link;
        type PageType = ${pages.join("|")};     
        
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
