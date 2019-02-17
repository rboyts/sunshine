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
    'arrow-parens': 'off',
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
