import path from "path";

import {
  MagipokaConfig,
  GenerateCliOptions,
  MagipokaStrictConfig,
  GenerateTargetTypes,
} from "../types";

export const loadConfig = async (filePath?: string): Promise<MagipokaStrictConfig> => {
  let configPath = path.resolve("./magipoka.config.js");

  if (filePath) {
    const { ext, dir, base } = path.parse(filePath);

    configPath =
      ext !== ".js" ? path.resolve(dir, base, "magipoka.config.js") : path.resolve(filePath);
  }

  const config = await import(configPath).catch(() => ({ default: {} }));

  return config.default;
};

export const mergeConfig = (
  baseConfig: MagipokaConfig,
  target: GenerateTargetTypes[],
  options: GenerateCliOptions
): MagipokaStrictConfig => {
  return {
    target: target || [],
    force: false,
    rootDir: process.cwd(),
    outDir: process.cwd(),
    filename: "magipoka.d.ts",
    ...baseConfig,
    ...options,
  };
};
