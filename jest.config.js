// jest.config.js
/** @type {import('jest').Config} */
module.exports = {
  /* ------------------------------------------------------------------ */
  /*  Core                                                              */
  /* ------------------------------------------------------------------ */
  clearMocks: true,                 // reset mocks between tests
  testEnvironment: 'jsdom',         // DOM‑like environment for React

  /* run extra setup (RTL matchers, etc.) */
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  /* Babel transform for JS / TS sources */
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  /* ------------------------------------------------------------------ */
  /*  Module name stubs                                                 */
  /* ------------------------------------------------------------------ */
  moduleNameMapper: {
    /* CSS modules → identity‑obj‑proxy gives you a hash‑like object   */
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',

    /* Static assets → simple manual mock                              */
    '\\.(png|jpe?g|gif|svg|webp|ico|bmp|eot|otf|ttf|woff2?)$':
      '<rootDir>/__mocks__/fileMock.js',
  },

  /* ------------------------------------------------------------------ */
  /*  Coverage                                                          */
  /* ------------------------------------------------------------------ */
  collectCoverage: true,
  coverageDirectory: 'coverage',
  /* v8 is faster ≥ Jest 29, Istanbul is OK too – pick one              */
  coverageProvider: 'v8',

  /* Instrument **all** source files in src/, except                */
  /* – tests / stories / mocks / barrels                               */
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/?(*.)+(test|spec).{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],



  /* Tell Jest where to look for modules (default is <rootDir>)         */
  roots: ['<rootDir>/src'],
};
