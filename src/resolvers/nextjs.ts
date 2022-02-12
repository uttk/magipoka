import fs from "fs/promises";
import path from "path";

export const getNextJsPageExtensions = async (
  configPath: string
): Promise<string[]> => {
  const config = await import(configPath);

  return Array.isArray(config.pageExtensions) ? config.pageExtensions : [".ts"];
};

export const getPages = async () => {
  return [];
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
