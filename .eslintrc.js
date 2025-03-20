module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'filenames'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/no-anonymous-default-export': 'warn',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'import/no-named-as-default': 'off',
    'filenames/match-regex': [
      'error',
      '^[a-z0-9\\-\\.]+$|^[A-Z][a-zA-Z0-9]+$',
      true
    ],
    'filenames/match-exported': ['error', 'pascal'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  overrides: [
    {
      files: ['**/use-*.ts', '**/use-*.tsx'],
      rules: {
        'filenames/match-regex': ['error', '^use-[a-z0-9\\-\\.]+$', true],
      },
    },
    {
      files: ['**/*.tsx'],
      excludedFiles: ['**/use-*.tsx', '**/*.test.tsx', '**/*.spec.tsx', '**/page.tsx', '**/layout.tsx', '**/error.tsx', '**/loading.tsx', '**/not-found.tsx'],
      rules: {
        'filenames/match-regex': ['error', '^[A-Z][a-zA-Z0-9]+$|^[a-z0-9\\-\\.]+$', true],
      },
    },
    {
      files: ['**/*.types.ts'],
      rules: {
        'filenames/match-regex': ['error', '^[a-z0-9\\-\\.]+\\.types$', true],
      },
    },
    {
      files: ['**/*.context.tsx'],
      rules: {
        'filenames/match-regex': ['error', '^[a-z0-9\\-\\.]+\\.context$', true],
      },
    },
  ],
};
