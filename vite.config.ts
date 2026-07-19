import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function copyStyles(): Plugin {
  return {
    name: 'copy-styles',
    closeBundle() {
      const src = path.resolve(__dirname, 'src/core/styles.css')
      const dest = path.resolve(__dirname, 'dist/styles.css')
      if (fs.existsSync(src)) {
        fs.cpSync(src, dest)
        console.log(`[copy-styles] Copied styles.css to dist/`)
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [react(), copyStyles()],
      build: {
        outDir: 'dist',
        lib: {
          entry: path.resolve(__dirname, 'src/core/index.ts'),
          name: 'Opentutorial',
          formats: ['es', 'cjs'],
          fileName: (format) => format === 'es' ? 'index.js' : 'index.cjs',
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
            },
          },
        },
        cssCodeSplit: false,
        sourcemap: true,
        emptyOutDir: true,
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src/site"),
        },
      },
    }
  }

  return {
    base: '/',
    plugins: [react()],
    server: {
      port: 3000,
    },
    build: {
      outDir: 'dist-site',
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/site"),
      },
    },
  }
})
