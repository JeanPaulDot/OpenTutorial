import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Needed so `.tsx` test files and the React adapter compile under vitest.
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/core/__tests__/setup.ts'],
    // .tsx is included so the React adapter and components are testable.
    include: ['src/core/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/core/**/*.{ts,tsx}'],
      exclude: [
        'src/core/__tests__/**',
        'src/core/**/*.d.ts',
        // Published re-export barrels — no logic to cover.
        'src/core/index.ts',
        'src/core/react.ts',
        'src/core/vue.ts',
        'src/core/svelte.ts',
        'src/core/angular.ts',
        'src/core/solid.ts',
        'src/core/webcomponent.ts',
        'src/core/global.ts',
        'src/core/**/index.ts',
        // A CSS string constant.
        'src/core/styles.ts',
      ],
      // Set just under the current numbers so ordinary work does not trip the
      // gate, but deleting a suite does. Ratchet up as coverage improves;
      // never down without a reason in the commit message.
      thresholds: {
        lines: 85,
        statements: 82,
        functions: 78,
        branches: 75,
      },
    },
  },
})
