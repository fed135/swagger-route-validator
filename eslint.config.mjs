import eslint from '@eslint/js';
import { globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import jestConfig from 'eslint-plugin-jest';
import spacing from '@stylistic/eslint-plugin';

export default tseslint.config(
  globalIgnores(['bin/*']),
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
