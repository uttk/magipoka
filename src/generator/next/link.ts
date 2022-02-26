export const generateNextLinkType = (): string => {
  return `
    declare module "next/link" {
      /// <reference types="node" />
      import React from "react";
      import { UrlObject } from "url";
      import { NextPagesType } from "magipoka/next";

      type Url = UrlObject | NextPagesType;

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
