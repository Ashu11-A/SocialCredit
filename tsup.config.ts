import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "build",
  format: ["esm"],
  target: "node22",
  jsx: "react-jsx",
  bundle: true,
  noExternal: [/.*/],
  dts: false,
  clean: true,
  sourcemap: false,
});
