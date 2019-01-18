module.exports = {
  preset: 'ts-jest',
  modulePaths: ['<rootDir>/src/'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  collectCoverage: false,
  testMatch: ['**/*.spec.(ts|tsx)'],
  setupFiles: ['<rootDir>/src/specs/setup.ts']
}
