import path from "path";

import { MagipokaStrictConfig } from "../types";

export const defaultConfig: MagipokaStrictConfig = {
  target: [],
  force: false,
  typeHelper: true,
  outDir: process.cwd(),
  rootDir: process.cwd(),
  filename: "magipoka.d.ts",
};

export const loadConfig = async (filePath?: string): Promise<MagipokaStrictConfig> => {
  let configPath = path.resolve("./magipoka.config.js");

  if (filePath) {
    const { ext, dir, base } = path.parse(filePath);

    configPath =
      ext !== ".js" ? path.resolve(dir, base, "magipoka.config.js") : path.resolve(filePath);
  }

  const config = await import(configPath).catch(() => ({ default: {} }));

  return { ...defaultConfig, ...config.default };
};
