import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxDev: false,
    jsxImportSource: "react",
  },
});
