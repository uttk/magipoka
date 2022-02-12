import { it, describe, expect, vi } from "vitest";

import { type NextConfig, getNextJsPages, getNextJsPageExtensions } from "./nextjs";
import * as utils from "./utils";

describe("getNextJsPageExtensions() Tests", () => {
  it("return page extensions for nextjs pages", async () => {
    vi.mock("next.config.js", () => ({ pageExtensions: [".page.tsx"] }));

    const extensions = await getNextJsPageExtensions("");

    expect(extensions).toStrictEqual([".page.tsx"]);
  });
});

describe("getPages() Tests", () => {
  it("returns a paths array from pages folders", async () => {
    const config: NextConfig = {
      pagesPath: "",
      pageExtensions: [".page.tsx"],
    };

    vi.spyOn(utils, "getFilePaths").mockResolvedValue(["/hello.tsx", "/world.page.tsx"]);

    const result = await getNextJsPages(config);

    expect(result).toStrictEqual(["/world"]);
  });
});
