import { defineConfig } from "vitest/config";
import { dirname, resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    testTimeout: 10000,
    fileParallelism: false,
  },
});
