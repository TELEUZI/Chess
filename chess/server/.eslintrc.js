export default {
  'root': true,
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'type': 'CommonJS',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
    'project': ['./tsconfig.json'],
    'extraFileExtensions': true,
  },
  'plugins': ['@typescript-eslint'],
};