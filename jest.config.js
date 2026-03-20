module.exports = {
  preset: "react-native",
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/__mocks__/styleMock.js",
    "^react-native-vector-icons/Ionicons$":
      "<rootDir>/__mocks__/IoniconsMock.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-safe-area-context|nativewind|react-native-css-interop)/)",
  ],
};
