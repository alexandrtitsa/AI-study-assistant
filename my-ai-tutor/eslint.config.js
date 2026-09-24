import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked, prettier],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      /* FSD Public API Enforcement */
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/pages/*/**',
                '@/widgets/*/**',
                '@/features/*/**',
                '@/entities/*/**',
              ],
              message:
                'FSD: Заборонено глибокі імпорти повз Public API (index.ts). Імпортуйте безпосередньо з Public API слайса (наприклад, "@/features/flip-card").',
            },
            {
              group: ['@/app/*/**'],
              // Дозволяємо імпорт глобальних стилів з шару app
              allowPatterns: ['@/app/styles/**'],
              message:
                'FSD: Заборонено глибокі імпорти з шару app, окрім стилів "@/app/styles/...".',
            },
            {
              group: ['@/shared/*/**'],
              // Дозволяємо доступ до вкладених сегментів shared (ui, lib, api, assets)
              allowPatterns: ['@/shared/*'],
              message:
                'FSD: Заборонено внутрішні глибокі імпорти з файлів shared. Використовуйте Public API сегмента (наприклад, "@/shared/ui").',
            },
          ],
        },
      ],
    },
  }
);