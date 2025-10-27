export default {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', {tsconfig: '<rootDir>/tsconfig.spec.json'}],
  },
  moduleNameMapper: {
    '^@red/shared$': '<rootDir>/../../libs/shared/src/index.ts'
  },
  coverageDirectory: '../../coverage/apps/api',
};
