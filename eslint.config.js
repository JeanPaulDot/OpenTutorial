import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'dist-site', 'node_modules', 'src/site/components/ui', 'src/site/hooks', 'src/site/demo', 'src/site/sections', 'src/site/pages/Demo.tsx', 'src/site/App.tsx', 'src/site/App.css', 'src/index.css']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/core/adapters/react.tsx'],
    rules: {
      'react-hooks/refs': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
])
