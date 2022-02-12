import path from "path";

import { Command } from "commander";

import { version } from "../package.json";

const cli = new Command();

// package settings
cli
  .name("magipoka")
  .description("Generate a safe routing *.d.ts files from the pages folder")
  .version(`v${version}`, "-v, --version");

// options
cli
  .option(
    "-o, --outDir <path>",
    "set a output directry path",
    path.resolve(process.cwd(), "index.d.ts")
  )
  .option("-t, --target <name>", "set the oputput target");

// actions
cli.action(async (argv) => {
  console.log(argv);
});

cli.parse();
