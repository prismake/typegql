module.exports = {
  modulePaths: ['<rootDir>/src/'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverage: false,
  testMatch: ['**/*.spec.(ts|tsx)'],
  setupFiles: ['<rootDir>/src/test/setup.ts'],
};
