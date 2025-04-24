module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },

  moduleNameMapper: {
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|svg|webp|ico|bmp|eot|otf|ttf|woff2?)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
};
