/* eslint-disable @typescript-eslint/no-explicit-any */

type DeepPartial<T> = T extends Record<string, any>
  ? T extends Array<any>
    ? T
    : {
        [P in keyof T]?: DeepPartial<T[P]>;
      }
  : T;

/**
 * Targets that support generation
 */
export type GenerateTargetTypes = "next" | "next/link";

/**
 * Strict setting type
 */
export interface MagipokaStrictConfig {
  /**
   * Allow files to be overwritten
   * @default
   * force: false // By default, it throw an error if the file already exists
   */
  force: boolean;

  /**
   * Root directory path
   * @default
   * rootDir: process.cwd() // current directory
   */
  rootDir: string;

  /**
   * Output directory path
   * @default
   * dir: process.cwd() // current directory
   */
  outDir: string;

  /**
   * Output file name
   * @default
   * filename: "magipoka.d.ts"
   */
  filename: string;

  /**
   * Target of the type to generate
   * @example
   * // Output all generateable Next.js related types
   * target: ["next"]
   *
   * // Output only "next / link" type
   * target: ["next/link"]
   *
   * // In this case, "next" has priority
   * target: ["next", "next/link"]
   */
  target: GenerateTargetTypes[];
}

/**
 * The Config type for Magipoka
 */
export type MagipokaConfig = DeepPartial<MagipokaStrictConfig>;

/**
 * CLI option type
 */
export interface GenerateCliOptions {
  readonly force?: boolean;
  readonly config?: string;
  readonly outDir?: string;
  readonly rootDir?: string;
  readonly filename?: string;
}

export type GeneratorType = () => Promise<string>;
