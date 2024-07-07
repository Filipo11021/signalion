const { resolve } = require('node:path');

const project = resolve(__dirname, 'tsconfig.app.json');

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    require.resolve('@vercel/style-guide/eslint/browser'),
    require.resolve('@vercel/style-guide/eslint/react'),
    'plugin:prettier/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:tailwindcss/recommended',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'pocketbase-types.ts',
    'vite.config.ts',
    'routeTree.gen.ts',
  ],
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      files: ['*.config.js', '*.config.ts', '*.config.mjs', '*.config.cjs'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  parserOptions: {
    project,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
};
