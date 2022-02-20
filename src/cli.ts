import type { MagipokaStrictConfig } from "./types";

import fs from "fs/promises";
import path from "path";

import { Argument, Command } from "commander";

import * as Generator from "./generator";
import { isExistsPath } from "./helpers/utils";

// eslint-disable-next-line
// @ts-ignore
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
  .option("-f, --force", "Forces the output of the files")
  .option("-r, --rootDir <path>", "set a root directory path")
  .option("-o, --outDir <path>", "set a output directry path")
  .option("-n, --filename <name>", "set the output file name");

// actions
cli.action(async (argv, options) => {
  if (options.rootDir) {
    process.chdir(options.rootDir);
  }

  const config: MagipokaStrictConfig = {
    output: {
      dir: path.join(process.cwd(), options.outDir || ""),
      filename: options.filename || "magipoka.d.ts",
    },
  };

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

  const fileStr = format(types.join(""), { parser: "typescript", printWidth: 100 });
  const outputPath = path.join(config.output.dir, config.output.filename);

  const exist = await isExistsPath(outputPath);

  if (exist && !options.force) {
    console.error(
      "The output destination already exists. To overwrite, use the `-f, --force` options."
    );

    process.exitCode = 1;

    return;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, fileStr);
});

cli.parse();
