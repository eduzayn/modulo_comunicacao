module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    // Disable specific rules for test files
    'react/display-name': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'react/display-name': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'import/no-anonymous-default-export': 'off',
      },
    },
  ],
};
