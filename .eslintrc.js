module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
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
    'no-restricted-syntax': 'off',
    'no-param-reassign': [2, {
      ignorePropertyModificationsFor: [
        'state', // vuex state mutations
      ],
    }],
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
