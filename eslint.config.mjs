import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import spacing from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { ignores: ['**/bin/**'] },
  spacing.configs.recommended,
  {
    files: ['**/*.{js,ts,mjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      ...ts.configs.recommended.rules,
      '@stylistic/semi': [2, 'always'],
      '@typescript-eslint/no-explicit-any': 0,
    },
  },
];
