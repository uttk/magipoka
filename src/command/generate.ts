import path from "path";

import { generateNextTypes } from "../generator/next";
import { loadConfig, mergeConfig } from "../helpers/config";
import { Logs } from "../helpers/logs";
import { saveFile } from "../helpers/utils";
import { GenerateTargetTypes, GenerateCliOptions } from "../types";

/**
 * supported generates type
 */
export const generateTargets: GenerateTargetTypes[] = ["next", "next/link"];

/**
 * filter generate target strings
 */
export const filterGenerateTargets = (
  supports: GenerateTargetTypes[],
  targets: GenerateTargetTypes[]
): GenerateTargetTypes[] => {
  return targets.filter((v) => {
    if (!supports.includes(v)) return false;

    const [parent, sub] = v.split("/") as GenerateTargetTypes[];

    return (!!parent && !sub) || !targets.includes(parent);
  });
};

/**
 * generate command
 */
const command = async (target: GenerateTargetTypes[], options: GenerateCliOptions) => {
  if (options.rootDir) {
    process.chdir(options.rootDir);
  }

  const baseConfig = await loadConfig(options.config);

  const config = mergeConfig(baseConfig, target, options);
  const targets = filterGenerateTargets(generateTargets, config.target);

  if (targets.length === 0) {
    const message = [
      "The output target was not found. Use the config file or the `-c, --config` option to set the output target.",
      "",
      `Available generate targets: [${generateTargets.map((v) => `"${v}"`).join(", ")}]`,
    ].join("\n");

    throw new Error(message);
  }

  const tasks = targets.map((target) => {
    if (target.includes("next")) return generateNextTypes(target);

    throw new Error(`Unsupported target value : ${target}`);
  });

  const types = await Promise.all(tasks);

  const {
    default: { format },
  } = await import("prettier");

  const fileStr = format(types.join(""), { parser: "typescript", printWidth: 100 });
  const outputPath = path.join(config.outDir, config.filename);

  if (!fileStr.length) throw new Error("Empty File can not generate");

  await saveFile(outputPath, fileStr, options.force);

  return { outputPath };
};

export const generateCommand = (target: GenerateTargetTypes[], options: GenerateCliOptions) => {
  const spinner = Logs.loading("Now generating...\n");

  command(target, options)
    .then(({ outputPath }) => {
      spinner.succeed(`File generation was successful!: ${Logs.link(outputPath)}\n`);
    })
    .catch((error) => {
      spinner.fail(` ${error?.message || "An Error has occurred"}\n`);
      process.exitCode = 1;
    });
};
