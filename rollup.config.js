import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";

export default {
  input: "dist/ng-ai/sw.js",
  output: {
    file: "dist/ng-ai/sw.js",
    format: "cjs",
  },
  plugins: [
    resolve(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
      preventAssignment: true,
    }),
    terser(),
  ],
};
