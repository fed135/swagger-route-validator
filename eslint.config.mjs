import eslint from '@eslint/js';
import jestConfig from 'eslint-plugin-jest';
import spacing from '@stylistic/eslint-plugin';

export default eslint.config(
  eslint.configs.recommended,
  jestConfig.configs['flat/recommended'],
  spacing.configs.recommended,
  {
    rules: {
      '@stylistic/semi': [2, 'always'],
      'jest/no-done-callback': 0,
    },
  },
);
