module.exports = {
  modulePaths: ['<rootDir>/src/'],
  moduleNameMapper:{
	  '~/(.*)':'<rootDir>/src/$1'
  },  
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/preprocessor.js',
  },
  collectCoverage: false,
  testMatch: ['**/*.spec.(ts|tsx)'],
  setupFiles: ['<rootDir>/src/test/setup.ts'],
};
