const nextJest = require("next/jest");

// next/jest wires up SWC compilation, path aliases (@/*) and env loading
// automatically from next.config.mjs + tsconfig.json, so tests run with
// the exact same module resolution as the app itself.
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  collectCoverageFrom: [
    "src/lib/**/*.ts",
    "src/app/api/**/*.ts",
    "!src/lib/i18n.ts",
  ],
};

module.exports = createJestConfig(customJestConfig);
