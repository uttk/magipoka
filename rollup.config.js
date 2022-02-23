import esbuild from "rollup-plugin-esbuild";
import jsonPlugin from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

export default [
  // cli
  {
    input: "src/cli.ts",
    output: {
      dir: "dist",
      format: "esm",
    },
    external: ["commander"],
    plugins: [esbuild(), jsonPlugin(), terser()],
  },

  // index
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm",
      compact: true,
    },
    plugins: [esbuild(), terser()],
  },
];
