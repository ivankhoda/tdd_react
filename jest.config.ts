import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  verbose: true,

  testEnvironment: "jsdom",
  // transform: {
  //   "^.+\\.ts?$": "ts-jest",
  // },
  // testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  // moduleFileExtensions: ["ts", "js", "json", "node"],
  collectCoverage: true,
  // clearMocks: true,
  coverageDirectory: "coverage",

  moduleNameMapper: {
    "\\.(s?css|less)$": "identity-obj-proxy",
  },
};

export default config;
