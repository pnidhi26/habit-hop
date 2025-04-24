// jest.config.js
module.exports = {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
  
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,
  
    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',
  
    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: 'istanbul',
  
    // A list of paths to directories that Jest should use to search for files in
    roots: ['<rootDir>/src'],
  
    // The test environment that will be used for testing
    testEnvironment: 'jsdom',
  
    // A map from regular expressions to paths to transformers
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
  
    // Setup files to run before each test
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  
    // Code coverage configuration
    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/**/*.d.ts',
      '!src/index.js',
      '!src/reportWebVitals.js',
      '!src/setupTests.js',
    ],
  
    // Coverage thresholds
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  };