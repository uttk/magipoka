import chalk from "chalk"; // eslint-disable-line import/no-unresolved
import logSymbols from "log-symbols";
import ora from "ora";
import terminalLink from "terminal-link";

export const Logs = {
  clear: () => {
    console.clear();
  },

  link: (text: string, link?: string): string => {
    return terminalLink(text, link || text);
  },

  loading: (message: string) => {
    console.log("");

    const spinner = ora(message).start();

    spinner.color = "blue";

    return spinner;
  },

  success: (message: string) => {
    console.log(logSymbols.success, chalk.green(message));
  },

  error: (message: string) => {
    console.log("");
    console.log(logSymbols.error, chalk.red(message));
    console.log("");
  },

  warn: (message: string) => {
    console.log(logSymbols.warning, chalk.yellow(message));
  },

  info: (message: string) => {
    console.log(logSymbols.info, message);
  },
};
