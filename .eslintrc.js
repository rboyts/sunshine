const os = require('os');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    curly: ['error', 'multi-line'],
    'operator-linebreak': ['error', 'after'],
    'prefer-const': 'off',
    'no-else-return': 'off',
    'no-underscore-dangle': 'off',
    'arrow-parens': 'off',
    'prefer-destructuring': ['error', {object: true, array: false}],
    'no-plusplus': 'off',
    'default-case': 'off',
    'linebreak-style': [1, os.platform() === 'win32' ? 'windows' : 'unix'],
    'no-restricted-syntax': 'off',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
