import { it, describe, expect, vi } from "vitest";

import { type NextConfig, getNextJsPages, getNextJsPageExtensions } from "./utils";

import * as utils from "../../helpers/utils";

describe("getNextJsPageExtensions() Tests", () => {
  it("return page extensions for nextjs pages", async () => {
    vi.mock("next.config.js", () => ({ pageExtensions: [".page.tsx"] }));

    const extensions = await getNextJsPageExtensions("");

    expect(extensions).toStrictEqual([".page.tsx"]);
  });
});

describe("getNextJsPages() Tests", () => {
  it("returns a paths array from pages folders", async () => {
    const config: NextConfig = {
      pagesPath: "",
      pageExtensions: [".page.tsx"],
    };

    vi.spyOn(utils, "getFilePaths").mockResolvedValue(["/hello.tsx", "/world.page.tsx"]);

    const result = await getNextJsPages(config);

    expect(result).toStrictEqual(["/world"]);
  });

  it("returns a non-covered value", async () => {
    const config: NextConfig = {
      pagesPath: "",
      pageExtensions: [".tsx"],
    };

    const pages = ["/[sample]/[param].tsx", "/[sample]/[param]/index.tsx"];

    vi.spyOn(utils, "getFilePaths").mockResolvedValue(pages);

    const result = await getNextJsPages(config);

    expect(result).toStrictEqual(["/${string}/${string}/"]);
  });

  it("returns expected paths", async () => {
    const config: NextConfig = {
      pagesPath: "",
      pageExtensions: [".tsx"],
    };

    const pages = [
      "/index.tsx",
      "/a.tsx",
      "/b/c.tsx",
      "/d/e/index.tsx",
      "/[p].tsx",
      "/[p]/[p2]/index.tsx",
      "/f/[p]/g.tsx",
      "/ccc/",
    ];

    const expectPages = [
      "/",
      "/a",
      "/b/c",
      "/d/e",
      "/${string}/",
      "/${string}/${string}/",
      "/f/${string}/g",
    ];

    vi.spyOn(utils, "getFilePaths").mockResolvedValue(pages);

    const result = await getNextJsPages(config);

    expect(result).toStrictEqual(expectPages);
  });
});
