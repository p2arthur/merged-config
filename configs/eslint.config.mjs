/**
 * Shared ESLint configuration for TypeScript projects.
 * Uses TypeScript-ESLint recommended rules, unused imports detection,
 * and Prettier integration.
 */
import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: ['.eslintrc.js', 'node_modules/**', 'dist/**', 'build/**', 'coverage/**', '**/generated/**', '.idea/**', '.vscode/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['warn', { ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-expressions': 'off',
      'prefer-template': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  prettier,
])
