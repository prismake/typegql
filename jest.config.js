module.exports = {
  modulePaths: ['<rootDir>/src/'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/preprocessor.js',
  },
  collectCoverage: false,
  testMatch: ['**/*.spec.(ts|tsx)'],
  setupFiles: ['<rootDir>/src/test/setup.ts'],
};
