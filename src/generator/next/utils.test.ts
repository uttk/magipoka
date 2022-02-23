import { it, describe, expect, vi } from "vitest";

import { getNextJsPages, getNextJsPageExtensions } from "./utils";

import * as utils from "../../helpers/utils";

describe("getNextJsPageExtensions() Tests", () => {
  it("return page extensions for nextjs pages", async () => {
    vi.mock("next.config.js", () => ({ pageExtensions: ["page.tsx"] }));

    const extensions = await getNextJsPageExtensions("");

    expect(extensions).toStrictEqual([".page.tsx"]);
  });
});

describe("getNextJsPages() Tests", () => {
  it("returns a paths array from pages folders", async () => {
    vi.spyOn(utils, "getFilePaths").mockResolvedValue(["/hello.tsx", "/world.page.tsx"]);

    const result = await getNextJsPages({ pagesPath: "", pageExtensions: [".page.tsx"] });

    expect(result).toStrictEqual(["/world"]);
  });

  it("returns a non-covered value", async () => {
    vi.spyOn(utils, "getFilePaths").mockResolvedValue([
      "/[sample]/[param].tsx",
      "/[sample]/[param]/index.tsx",
    ]);

    const result = await getNextJsPages({ pagesPath: "", pageExtensions: [".tsx"] });

    expect(result).toStrictEqual(["/${string}/${string}/"]);
  });

  it("returns expected paths", async () => {
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

    vi.spyOn(utils, "getFilePaths").mockResolvedValue(pages);

    const result = await getNextJsPages({ pagesPath: "", pageExtensions: [".tsx"] });

    expect(result).toStrictEqual([
      "/",
      "/a",
      "/b/c",
      "/d/e",
      "/${string}/",
      "/${string}/${string}/",
      "/f/${string}/g",
      "/ddd/${string}",
    ]);
  });

  it("does not include invalid pages", async () => {
    const ignorePages = ["_app.tsx", "hoge.ts"];

    vi.spyOn(utils, "getFilePaths").mockResolvedValue(ignorePages);

    const result = await getNextJsPages({ pagesPath: "", pageExtensions: [".tsx"] });

    expect(result).toHaveLength(0);
  });
});
