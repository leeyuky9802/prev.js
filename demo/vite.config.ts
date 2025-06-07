import alias from "@rollup/plugin-alias";
import { defineConfig } from "vite";

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
  define: {
    __DEV__: true,
  },
  // resolve: {
  //   alias: [
  //     {
  //       find: "ReactFiberConfig",
  //       replacement: "react",
  //     },
  //   ],
  // },
});
