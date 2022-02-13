import esbuild from "rollup-plugin-esbuild";
import jsonPlugin from "@rollup/plugin-json";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "commonjs",
    },
    plugins: [esbuild(), jsonPlugin()],
  },
];
