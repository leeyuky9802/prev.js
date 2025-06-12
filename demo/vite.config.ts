import { defineConfig } from "vite";
import alias from "@rollup/plugin-alias";

export default defineConfig({
  plugins: [
    alias({
      entries: [
        {
          find: "ReactFiberConfig",
          replacement:
            "/Users/xiaoyang/prev.js/packages/react-dom/src/ReactFiberConfigDOM",
        },
      ],
    }),
  ],
  esbuild: {
    jsx: "automatic",
    jsxDev: false,
    jsxImportSource: "react",
  },
});
