module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  testPathIgnorePatterns: [
    "/test/dbTest.test.js$"
  ],
  "moduleNameMapper": {
    "react-native": "<rootDir>/config/jest/reactNativeMock.js"
  },
};
