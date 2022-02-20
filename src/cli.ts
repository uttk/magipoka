import { Argument, Command } from "commander";

import { generateCommand, generateTargets } from "./command/generate";

// eslint-disable-next-line
// @ts-ignore
import { version } from "../package.json";

const cli = new Command();

// package settings
cli
  .name("magipoka")
  .description("Generate safe routing *.d.ts files from the pages folder")
  .version(`v${version}`, "-v, --version");

// generate command
cli
  .command("generate")
  .description("Generate type files from passed options")
  .addArgument(new Argument("<targets...>", "oputput target").choices(generateTargets))
  .option("-f, --force", "Forces the output of the files")
  .option("-r, --rootDir <path>", "set a root directory path")
  .option("-o, --outDir <path>", "set a output directry path")
  .option("-n, --filename <name>", "set a output filename")
  .option("-c, --config <path>", "set a config path")
  .action(generateCommand);

// default command
cli
  .description("default command")
  .option("-c, --config <path>", "set a config path")
  .action(async (options) => {
    const configPath = options.config;

    if (!configPath) {
      cli.help();
      return;
    }

    await generateCommand([], { config: configPath });
  });

cli.parse();
