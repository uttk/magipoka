import fs from "fs/promises";
import path from "path";

import {
  MagipokaConfig,
  GenerateCliOptions,
  MagipokaStrictConfig,
  GenerateTargetTypes,
} from "../types";

export const loadConfig = async (configPath: string): Promise<MagipokaStrictConfig> => {
  return fs.readFile(path.resolve(configPath), "utf8").then((v) => JSON.parse(v));
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
