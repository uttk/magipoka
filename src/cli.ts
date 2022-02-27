import { Argument, Command } from "commander";

import { generateCommand, allowGenerateTargets } from "./command/generate";

// eslint-disable-next-line
// @ts-ignore
import pkg from "../package.json";

const cli = new Command();

// package settings
cli
  .name("magipoka")
  .description("Generate safe routing *.d.ts files from the pages folder")
  .version(`v${pkg.version}`, "-v, --version");

// generate command
cli
  .command("generate", { isDefault: true })
  .description("Generate type files from passed options")
  .addArgument(new Argument("[targets...]", "oputput target").choices(allowGenerateTargets))
  .option("-f, --force", "Forces the output of the files")
  .option("-r, --rootDir <path>", "set a root directory path")
  .option("-o, --outDir <path>", "set a output directry path")
  .option("-n, --filename <name>", "set a output filename")
  .option("-c, --config <path>", "set a config path")
  .option("-t, --type-helper", "enable the Type Helper")
  .option("--no-type-helper", "disable type helper")
  .action(generateCommand);

cli.parse();
