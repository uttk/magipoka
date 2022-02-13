/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from "fs/promises";

import { vi, describe, it, expect } from "vitest";

import { getExistsPath, getFilePaths, isSameExtension } from "./utils";

describe("getExistsPath() Tests", () => {
  it("return a exists path", async () => {
    const paths = ["/bad/path", "/good/path"];
    const accessMock = vi.spyOn(fs, "access").mockImplementation(async (path) => {
      if (path !== paths[1]) throw new Error();
    });

    const result = await getExistsPath(paths);

    expect(result).toBe(paths[1]);
    expect(accessMock).toBeCalled();
  });
});

describe("isSameExtension() Tests", () => {
  it("return true when match passed extensions", () => {
    const exts = [".js", ".ts"];

    const matchFiles = ["index.js", "hoge.ts"];
    matchFiles.forEach((file) => expect(isSameExtension(file, exts)).toBe(true));

    const notMatchFiles = ["hello.jsx", "world.tsx"];
    notMatchFiles.forEach((file) => expect(isSameExtension(file, exts)).toBe(false));
  });
});

const readdirSpy = vi.spyOn(fs, "readdir");

describe("getFilePaths() Tests", () => {
  it("return file paths from passed root path", async () => {
    const exts = [".page"];

    const mockFiles = [
      { name: "hoge.page", isFile: () => true, isDirectory: () => false },
      { name: "hoge.page", isFile: () => false, isDirectory: () => false },
    ] as any;

    readdirSpy.mockReturnValue(mockFiles);

    const result = await getFilePaths("/root", exts);

    expect(result).toStrictEqual([`/root/${mockFiles[0].name}`]);
  });
});
