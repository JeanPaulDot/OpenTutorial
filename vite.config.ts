import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { CSS } from './src/core/styles';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * `dist/styles.css` is generated from `src/core/styles.ts`, which is also what
 * shadow-isolated layers inject at runtime. One source, so the two cannot drift.
 */
function emitStyles(): Plugin {
  return {
    name: 'emit-styles',
    closeBundle() {
      const dest = path.resolve(__dirname, 'dist/styles.css');
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, `${CSS}\n`, 'utf8');
      console.log('[emit-styles] wrote dist/styles.css');
    },
  };
}

/** Copies the JSON Schema next to the build so editors can resolve it. */
function copySchema(): Plugin {
  return {
    name: 'copy-schema',
    closeBundle() {
      const src = path.resolve(__dirname, 'schema/spec.schema.json');
      if (!fs.existsSync(src)) return;
      fs.copyFileSync(src, path.resolve(__dirname, 'dist/spec.schema.json'));
      console.log('[copy-schema] wrote dist/spec.schema.json');
    },
  };
}

const external = ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'];

/**
 * Two builds:
 *  - default: multi-entry ESM + CJS, one file per framework, React kept external
 *  - iife:    single self-contained global bundle for plain <script> tags
 */
const isIIFE = process.env.BUILD_TARGET === 'iife';

export default defineConfig({
  plugins: [react(), ...(isIIFE ? [] : [emitStyles(), copySchema()])],
  build: {
    outDir: 'dist',
    emptyOutDir: !isIIFE,
    sourcemap: true,
    cssCodeSplit: false,
    target: 'es2020',
    ...(isIIFE
      ? {
          lib: {
            entry: path.resolve(__dirname, 'src/core/global.ts'),
            name: 'Opentutorial',
            formats: ['iife' as const],
            fileName: () => 'opentutorial.global.js',
          },
          // The global build is for pages without a bundler, so nothing is
          // external — React is not part of this entry at all.
          rollupOptions: { output: { extend: true } },
          minify: 'esbuild' as const,
        }
      : {
          lib: {
            entry: {
              index: path.resolve(__dirname, 'src/core/index.ts'),
              react: path.resolve(__dirname, 'src/core/react.ts'),
              vue: path.resolve(__dirname, 'src/core/vue.ts'),
              svelte: path.resolve(__dirname, 'src/core/svelte.ts'),
              webcomponent: path.resolve(__dirname, 'src/core/webcomponent.ts'),
              authoring: path.resolve(__dirname, 'src/core/authoring/index.ts'),
              analytics: path.resolve(__dirname, 'src/core/analytics/index.ts'),
            },
            formats: ['es' as const, 'cjs' as const],
            fileName: (format, entryName) =>
              (format === 'es' ? `${entryName}.js` : `${entryName}.cjs`),
          },
          rollupOptions: {
            external,
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
                'react/jsx-runtime': 'jsxRuntime',
              },
              // Shared code goes to predictable chunk names rather than hashed
              // ones, so the published file list stays stable across releases.
              chunkFileNames: (chunk) => `chunks/${chunk.name}.[format].js`,
            },
          },
        }),
  },
});
