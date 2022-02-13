import type { TypeGenerator } from "../types";

import fs from "fs/promises";
import path from "path";

import { getNextJsPageExtensions, getNextJsPages } from "../helpers/nextjs";
import { getExistsPath } from "../helpers/utils";

const defaultPages = ["//${string}", "http://${string}", "https://${string}"];

const generator: TypeGenerator = async () => {
  const cwd = process.cwd();
  const modulePath = path.join(process.cwd(), "node_modules/next/dist/client/link.d.ts");

  const [pagesPath, pageExtensions, typeModule] = await Promise.all([
    getExistsPath([path.join(cwd, "pages"), path.join(cwd, "src/pages")]),
    getNextJsPageExtensions(cwd).catch(() => [".jsx", ".tsx"]),
    fs.readFile(modulePath, "utf-8"),
  ]);

  const pages = await getNextJsPages({ pagesPath, pageExtensions });

  pages.push(...defaultPages);

  return `
    declare module "__next/link__" {
      ${typeModule.replace(/\bdeclare\b/g, "")}
    }

    declare module "next/link" {
      import Link from "__next/link__";

      type LinkType = typeof Link;
      type LinkArgs = Parameters<LinkType>;
      type LinkReturn = ReturnType<LinkType>;    
      type PageType = ${pages.map((v) => `\`${v}\``).join("|")};

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

export default generator;
