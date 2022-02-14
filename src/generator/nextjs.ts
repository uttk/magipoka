import type { TypeGenerator } from "../types";

import path from "path";

import { getNextJsPageExtensions, getNextJsPages } from "../helpers/nextjs";
import { getExistsPath } from "../helpers/utils";

const defaultPages = ["//${string}", "http://${string}", "https://${string}"];

const generator: TypeGenerator = async () => {
  const cwd = process.cwd();

  const [pagesPath, pageExtensions] = await Promise.all([
    getExistsPath([path.join(cwd, "pages"), path.join(cwd, "src/pages")]),
    getNextJsPageExtensions(cwd).catch(() => [".jsx", ".tsx"]),
  ]);

  const pages = await getNextJsPages({ pagesPath, pageExtensions });

  pages.push(...defaultPages);

  return `
    declare module "next/link" {
      /// <reference types="node" />
      import React from "react";
      import { UrlObject } from "url";

      type PageType = ${pages.map((v) => `\`${v}\``).join("|")};

      type Url = UrlObject | PageType;

      export type LinkProps = {
        href: Url;
        as?: Url;
        replace?: boolean;
        scroll?: boolean;
        shallow?: boolean;
        passHref?: boolean;
        prefetch?: boolean;
        locale?: string | false;
      };

      function Link(props: React.PropsWithChildren<LinkProps>): React.DetailedReactHTMLElement<
        {
          onMouseEnter?: React.MouseEventHandler<Element> | undefined;
          onClick: React.MouseEventHandler;
          href?: string | undefined;
          ref?: any;
        },
        HTMLElement
      >;

      export default Link;
    }
  `;
};

export default generator;
