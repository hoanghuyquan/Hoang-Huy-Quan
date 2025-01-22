import eslintPluginSortDestructureKeys from 'eslint-plugin-sort-destructure-keys'
import eslintPluginSortKeys from 'eslint-plugin-sort-keys'
import eslintPluginTypescriptSortKeys from 'eslint-plugin-typescript-sort-keys'
import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    ignores: [
      'node_modules/',
      'build/*.js',
      'config/*.js',
      'coverage/*.js',
      'coverage/*',
      'jest/*.js',
      '__tests__/*',
      '__tests__/*.js',
      '*.test.*',
      'tsconfig.json',
    ],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'sort-destructure-keys': eslintPluginSortDestructureKeys,
      'sort-keys': eslintPluginSortKeys,
      'typescript-sort-keys': eslintPluginTypescriptSortKeys,
    },
    rules: {
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'jsx-quotes': ['error', 'prefer-single'],
      semi: ['error', 'never'],
      'sort-destructure-keys/sort-destructure-keys': 'error',
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: false,
          ignoreCase: false,
          ignoreDeclarationSort: false,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
      'sort-keys': 'error',
      'sort-keys/sort-keys-fix': 'error',
      'typescript-sort-keys/interface': 'error',
      'typescript-sort-keys/string-enum': 'error',
    },
  },
]
