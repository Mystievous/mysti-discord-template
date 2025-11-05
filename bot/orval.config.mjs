import { defineConfig } from "orval";

export default defineConfig({
  fastapi: {
    input: "../api/openapi.json",
    output: {
      mode: "tags",
      target: "scripts/api/generated/endpoints",
      schemas: "scripts/api/generated/models",
      override: {
        mutator: {
          path: "./scripts/api/utils/orval-mutator.ts",
          name: "orvalAxios",
        },
      },
    },
  },
});
