import path from "path";
import { it, describe, expect, vi } from "vitest";

import { getPages, getNextJsPageExtensions } from "./nextjs";

describe("getNextJsPageExtensions() Tests", () => {
  const configPath = "./next.config.js";

  vi.mock(configPath, () => ({ pageExtensions: [".page.tsx"] }));

  it("return page extensions for nextjs pages", async () => {
    const extensions = await getNextJsPageExtensions(configPath);
    expect(extensions).toStrictEqual([".page.tsx"]);
  });
});

describe("getPages() Tests", () => {
  it("returns a paths array from pages folders", async () => {
    const result = await getPages();
    expect(result).toBeInstanceOf(Array);
  });
});
