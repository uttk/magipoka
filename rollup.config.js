import esbuild from "rollup-plugin-esbuild";

export default [
  // ES Module
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "commonjs",
    },
    plugins: [esbuild()],
  },
];
