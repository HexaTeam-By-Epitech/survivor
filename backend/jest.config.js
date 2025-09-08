module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests", "<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js"
  ],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/node_modules/**",
    "!coverage/**"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  verbose: true,
  setupFilesAfterEnv: [],
  testTimeout: 10000,
  moduleNameMapper: {
    "^@entities/(.*)$": "<rootDir>/src/entities/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@repositories/(.*)$": "<rootDir>/src/repositories/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@routes/(.*)$": "<rootDir>/src/routes/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1"
  },
  setupFiles: ["<rootDir>/tests/setup.js"]
};
