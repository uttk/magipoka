export interface MagipokaStrictConfig {
  output: {
    dir: string;
    filename: string;
  };
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type MagipokaConfig = DeepPartial<MagipokaStrictConfig>;

export type TypeGenerator = (config: MagipokaStrictConfig) => string | Promise<string>;
