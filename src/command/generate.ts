import path from "path";

import { allowNextJsTargets, generateNextTypes } from "../generator/next";
import { loadConfig } from "../helpers/config";
import { Logs } from "../helpers/logs";
import { saveFile } from "../helpers/utils";
import { GenerateTargetTypes, GenerateCliOptions } from "../types";

/**
 * supported generates type
 */
export const allowGenerateTargets: GenerateTargetTypes[] = [...allowNextJsTargets];

/**
 * generate command
 */
const command = async (target: GenerateTargetTypes[], options: GenerateCliOptions) => {
  if (options.rootDir) {
    process.chdir(options.rootDir);
  }

  const baseConfig = await loadConfig(options.config);
  const config = {
    ...baseConfig,
    ...options,
    target: baseConfig.target.concat(target).filter((v) => allowGenerateTargets.includes(v)),
  };

  if (config.target.length === 0) {
    const message = [
      "The output target was not found. Use the config file or the `-c, --config` option to set the output target.",
      "",
      `Available generate targets: [${allowGenerateTargets.map((v) => `"${v}"`).join(", ")}]`,
    ].join("\n");

    throw new Error(message);
  }

  const tasks = [generateNextTypes(config)];

  const types = await Promise.all(tasks).then((results) => {
    return results.filter<string>((v): v is string => !!v);
  });

  const {
    default: { format },
  } = await import("prettier");

  const fileStr = format(types.join(""), { parser: "typescript", printWidth: 100 });
  const outputPath = path.join(config.outDir, config.filename);

  if (!fileStr.length) throw new Error("Empty File can not generate");

  await saveFile(outputPath, fileStr, config.force);

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
