import { defineConfig } from "orval";

export default defineConfig({
  fastapi: {
    input: "../api/openapi.json",
    output: {
      mode: "tags",
      client: "fetch",
      target: "scripts/api/generated/endpoints",
      schemas: "scripts/api/generated/models",
      // Clean the output folders before generating
      clean: true,
      override: {
        // Convert date fields to proper Date objects
        useDatesTransform: true,
        mutator: {
          path: "./scripts/api/utils/orval-mutator.ts",
          name: "apiFetch",
        },
      },
    },
  },
});
