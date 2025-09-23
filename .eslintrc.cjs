module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    ecmaVersion: 2024,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: { browser: true, node: true, es2021: true },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'import'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.*',
          'e2e/**',
          'vitest.config.*',
          '**/__tests__/**',
          'src/setupTests.ts',
          'src/mocks/**',
        ],
      },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  // TS handles prop types; avoid requiring defaultProps on optional props
  'react/require-default-props': 'off',
  // allow prop spreading (used with react-hook-form register)
  'react/jsx-props-no-spreading': 'off',
  // relax label-associated-control (many labels are group-level and use ids)
  'jsx-a11y/label-has-associated-control': 'off',
  },
};
