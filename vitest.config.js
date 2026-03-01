import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      all: true,
      include: [
        "src/shared/constants/**/*.js",
        "src/shared/services/**/*.js",
        "src/shared/utils/**/*.js",
        "src/app/providers/theme-provider.js",
        "src/app/providers/service-worker-provider.js",
        "src/app/providers/document-metadata-provider.js",
        "src/features/contact/contact-feature.js",
        "src/features/navigation/navigation-shortcuts-feature.js",
      ],
      thresholds: {
        lines: 90,
        statements: 90,
      },
    },
  },
  resolve: {
    alias: {
      "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
    },
  },
});
