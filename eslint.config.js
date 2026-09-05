import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // dev-dist en dist zijn gegenereerde build-artefacten (Vite/PWA) - nooit linten.
  globalIgnores(['dist', 'dev-dist']),
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['scripts/**', 'vitest.config.js', 'public/**', 'src/test/**'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  // Node-scripts (buiten de browserbundel) en de vitest-config draaien onder Node, niet de browser.
  {
    files: ['scripts/**/*.js', 'vitest.config.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  // De service worker in public/ draait in een serviceworker-context, niet de browser-DOM.
  {
    files: ['public/service-worker.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.serviceworker,
    },
  },
  // Testsetup gebruikt Node's globale `global` object naast de browser-DOM (jsdom).
  {
    files: ['src/test/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
