import { it, describe, expect, vi } from "vitest";

import { formatNextJsPages, getNextJsPageExtensions, getNextJsPagePaths } from "./utils";

describe("getNextJsPageExtensions() Tests", () => {
  it("return page extensions for nextjs pages", async () => {
    vi.mock("next.config.js", () => ({ pageExtensions: ["page.tsx"] }));

    const extensions = await getNextJsPageExtensions("");

    expect(extensions).toStrictEqual([".page.tsx"]);
  });
});

describe("formatNextJsPages() Tests", () => {
  it("remove pagesPath", () => {
    const result = formatNextJsPages({
      pages: ["/remove-path/pages/hoge.tsx"],
      pagesPath: "/remove-path",
      pageExtensions: [".tsx"],
    });

    expect(result).toStrictEqual(["/pages/hoge"]);
  });

  it("returns a paths array from pages folders", () => {
    const result = formatNextJsPages({
      pages: ["/hello.tsx", "/world.page.tsx"],
      pagesPath: "",
      pageExtensions: [".page.tsx"],
    });

    expect(result).toStrictEqual(["/world"]);
  });

  it("returns a non-covered value", () => {
    const result = formatNextJsPages({
      pages: ["/[sample]/[param].tsx", "/[sample]/[param]/index.tsx"],
      pagesPath: "",
      pageExtensions: [".tsx"],
    });

    expect(result).toStrictEqual(["/[sample]/[param]", "/[sample]/[param]/index"]);
  });

  it("returns expected paths", () => {
    const pages = [
      "/index.tsx",
      "/a.tsx",
      "/b/c.tsx",
      "/d/e/index.tsx",
      "/[p].tsx",
      "/[p]/[p2]/index.tsx",
      "/f/[p]/g.tsx",
      "/ccc/",
      "/ddd/[...params].tsx",
    ];

    const result = formatNextJsPages({ pages, pagesPath: "", pageExtensions: [".tsx"] });

    expect(result).toStrictEqual([
      "/index",
      "/a",
      "/b/c",
      "/d/e/index",
      "/[p]",
      "/[p]/[p2]/index",
      "/f/[p]/g",
      "/ddd/[...params]",
    ]);
  });

  it("does not include invalid pages", () => {
    const ignorePages = ["_app.tsx", "hoge.ts"];

    const result = formatNextJsPages({
      pages: ignorePages,
      pagesPath: "",
      pageExtensions: [".tsx"],
    });

    expect(result).toHaveLength(0);
  });
});

describe("getNextJsPagePaths() Tests", () => {
  it("convert to template string type", () => {
    const results = getNextJsPagePaths([
      "/index",
      "/hoge",
      "/hoge/[param]",
      "/hoge/[param]/[param2]",
      "/hello/[...world]",
    ]);
    expect(results).toStrictEqual([
      "/",
      "/hoge",
      "/hoge/${string}/",
      "/hoge/${string}/${string}/",
      "/hello/${string}",
    ]);
  });

  it("remove duplicates", () => {
    const results = getNextJsPagePaths(["/hoge", "/hoge", "/hoge/index"]);
    expect(results).toStrictEqual(["/hoge"]);
  });
});
