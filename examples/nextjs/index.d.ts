declare module "__next/link__" {
  /// <reference types="node" />
  import React from "react";
  import { UrlObject } from "url";
  type Url = string | UrlObject;
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

declare module "next/link" {
  import Link from "__next/link__";

  type LinkType = typeof Link;
  type LinkArgs = Parameters<LinkType>;
  type LinkReturn = ReturnType<LinkType>;
  type PageType = `/` | `//${string}` | `http://${string}` | `https://${string}`;

  type ExtendPageType<T> = { href: Exclude<T, string> | PageType };

  type InjectCustomType<A> = A extends [infer F, ...infer N]
    ? F extends { href: any }
      ? [Omit<F, "href"> & ExtendPageType<F["href"]>, ...InjectCustomType<N>]
      : [F, ...InjectCustomType<N>]
    : A;

  export default function CustomLink(...args: InjectCustomType<LinkArgs>): LinkReturn;
}
