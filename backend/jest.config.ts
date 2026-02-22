import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    "^@scalar/express-api-reference$":
      "<rootDir>/tests/__mocks__/@scalar/express-api-reference.ts",
  },
};

export default config;
