import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import * as parserVue from 'vue-eslint-parser';
import configPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import { defineFlatConfig } from 'eslint-define-config';
import * as parserTypeScript from '@typescript-eslint/parser';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';

export default defineFlatConfig([
  {
    ...js.configs.recommended,
    ignores: ['dist/**/*'],
  },
  ...pluginVue.configs['flat/strongly-recommended'],
  {
    files: ['**/*.vue', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...configPrettier.rules,
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.vue', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: parserTypeScript,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
    },
    rules: {
      ...pluginTypeScript.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
]);