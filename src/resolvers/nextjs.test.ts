import { it, describe, expect, vi } from "vitest";

import { getPages } from "./nextjs";

import * as helpers from "../helpers/nextjs";
import * as utils from "../helpers/utils";

describe("getPages() Tests", () => {
  it("returns a paths array from pages folders", async () => {
    const exts = [".page.tsx"];
    const pages = ["/hello.tsx", "/world.page.tsx"];

    vi.spyOn(utils, "getExistsPath").mockResolvedValue("");
    vi.spyOn(utils, "getPageFilePaths").mockResolvedValue(pages);
    vi.spyOn(helpers, "getNextJsPageExtensions").mockResolvedValue(exts);

    const result = await getPages();

    expect(result).toStrictEqual(["/world"]);
  });
});
