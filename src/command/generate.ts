import path from "path";

import { generateNextTypes } from "../generator/next";
import { loadConfig, mergeConfig } from "../helpers/config";
import { saveFile } from "../helpers/utils";
import { GenerateTargetTypes, GenerateCliOptions } from "../types";

/**
 * supported generates type
 */
export const generateTargets: GenerateTargetTypes[] = ["next", "next/link"];

/**
 * generate command
 */
const command = async (target: GenerateTargetTypes[], options: GenerateCliOptions) => {
  if (options.rootDir) {
    process.chdir(options.rootDir);
  }

  const baseConfig = options.config ? await loadConfig(options.config) : {};

  const config = mergeConfig(baseConfig, target, options);

  const tasks = config.target.map((target) => {
    switch (target) {
      case "next":
        return generateNextTypes({ link: true });

      case "next/link":
        return generateNextTypes({ link: true });

      default:
        throw new Error(`Unsupported target value : ${target}`);
    }
  });

  const types = await Promise.all(tasks);

  const {
    default: { format },
  } = await import("prettier");

  const fileStr = format(types.join(""), { parser: "typescript", printWidth: 100 });
  const outputPath = path.join(config.outDir, config.filename);

  if (!fileStr.length) throw new Error("Empty File can not generate");

  await saveFile(outputPath, fileStr, options.force);
};

export const generateCommand = (target: GenerateTargetTypes[], options: GenerateCliOptions) => {
  command(target, options).catch((error) => {
    console.error(error?.message || "An Error has occurred");
    process.exitCode = 1;
  });
};
