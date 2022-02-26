/**
 * Targets that support generation
 */
export type GenerateTargetTypes = "next" | "next/link";

/**
 * The Config type for Magipoka
 */
export interface MagipokaConfig {
  /**
   * Allow files to be overwritten
   *
   * @default
   * force: false // By default, it throw an error if the file already exists
   */
  force?: boolean;

  /**
   * Enable Type Helpers
   *
   * @default
   * typeHelper: true // By default, Type Helper is enabled
   *
   * @example
   * // If you enable this option, a type helper will be added,
   * // also The type helper string refers to the source file name
   * type GeneratedPagesType =
   *  | "/any"
   *  | "/user/${string}/"
   *  | "path:/any"
   *  | "path:/user/[uid]"
   *  | ...
   *
   * // If you disable  this option, the type helper will not be added
   * type GeneratedPagesType =
   *  | "/any"
   *  | "/user/${string}/"
   *  | ...
   *
   */
  typeHelper?: boolean;

  /**
   * Root directory path
   *
   * @default
   * rootDir: process.cwd() // current directory
   */
  rootDir?: string;

  /**
   * Output directory path
   *
   * @default
   * dir: process.cwd() // current directory
   */
  outDir?: string;

  /**
   * Output file name
   *
   * @default
   * filename: "magipoka.d.ts"
   */
  filename?: string;

  /**
   * Target of the type to generate
   *
   * @default
   * target: [] // By default, nothing is specified
   *
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
  target?: GenerateTargetTypes[];
}

/**
 * Strict setting type
 */
export type MagipokaStrictConfig = Required<MagipokaConfig>;

/**
 * CLI option type
 */
export interface GenerateCliOptions {
  readonly force?: boolean;
  readonly config?: string;
  readonly outDir?: string;
  readonly rootDir?: string;
  readonly filename?: string;
  readonly typeHelper?: boolean;
}

export type GeneratorType = () => Promise<string>;
