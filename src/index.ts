import type { MagipokaStrictConfig } from "./types";

import fs from "fs/promises";
import path from "path";

import { Argument, Command } from "commander";

import * as Generator from "./generator";
import { mergeConfig } from "./helpers/utils";

import { version } from "../package.json";

const cli = new Command();

const supportTargets = ["next"];

// package settings
cli
  .name("magipoka")
  .description("Generate a safe routing *.d.ts files from the pages folder")
  .version(`v${version}`, "-v, --version");

// options
cli
  .addArgument(new Argument("<target>", "oputput target").choices(supportTargets))
  .option("-r, --rootDir <path>", "set a root directory path")
  .option("-c, --config <path>", "set the config path")
  .option("-o, --outDir <path>", "set a output directry path");

// actions
cli.action(async (argv, options) => {
  if (options.rootDir) {
    process.chdir(options.rootDir);
  }

  let config: MagipokaStrictConfig = {
    output: {
      dir: process.cwd(),
      filename: "index.d.ts",
    },
  };

  if (options.config) {
    const customConfig = await import(path.resolve(options.config));
    config = mergeConfig(customConfig.default, config);
  }

  const types: string[] = [];

  switch (argv) {
    case "next": {
      const result = await Generator.Next(config);
      types.push(result);
      break;
    }

    default:
      throw new Error("Not supports target...");
  }

  const {
    default: { format },
  } = await import("prettier");

  const fileStr = format(types.join(""), { parser: "typescript" });
  const outputPath = path.join(config.output.dir, config.output.filename);

  await fs.writeFile(outputPath, fileStr);
});

cli.parse();
