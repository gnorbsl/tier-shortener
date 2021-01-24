module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': [
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      { allow: ['warn', 'error'] },
    ],
    'import/order': 'error',
    'object-curly-spacing': 'error',
    'prefer-object-spread': 'error',
    'class-methods-use-this': 'warn',
    'no-plusplus': 'warn',
    'no-param-reassign': 'warn',
    curly: ['error', 'all'],
    'dot-notation': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'no-useless-rename': 'error',
  },
};
