import { it, describe, expect, vi } from "vitest";

import { getNextJsPageExtensions } from "./nextjs";

describe("getNextJsPageExtensions() Tests", () => {
  it("return page extensions for nextjs pages", async () => {
    vi.mock("next.config.js", () => ({ pageExtensions: [".page.tsx"] }));

    const extensions = await getNextJsPageExtensions("");

    expect(extensions).toStrictEqual([".page.tsx"]);
  });
});
