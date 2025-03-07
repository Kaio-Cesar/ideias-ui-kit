import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

import pkg from './package.json'

let currentFormat = ''

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      tsconfigPath: 'tsconfig.build.json',
      cleanVueFileName: true,
      exclude: ['src/__test__/**', 'src/**/__story__/**', 'src/**/*.story.vue'],
      rollupTypes: true,
      include: ['src/**/*.vue', 'src/**/*.ts'],
      compilerOptions: {
        declaration: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['vue', '@vue/runtime-core'],
  },
  build: {
    minify: false,
    target: 'esnext',
    sourcemap: true,
    lib: {
      name: 'ideias-ui-kit',
      formats: ['cjs', 'es'],
      fileName: (format, name) => {
        currentFormat = format
        return `${name}.${format === 'es' ? 'js' : 'cjs'}`
      },
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies ?? {})],
      output: {
        format: 'esm',
        inlineDynamicImports: false,
        // preserveModules: true,
        // preserveModulesRoot: 'src',
        manualChunks: (moduleId, meta) => {
          const info = meta.getModuleInfo(moduleId)
          if (!info?.isIncluded) {
            return null
          }

          const parts = moduleId.split('?')[0].split('/')
          if (parts.length < 2) {
            return null
          }

          const [namespace, file] = parts.slice(-2)
          const result = `${namespace}/${file.slice(0, file.lastIndexOf('.'))}`
          return result
        },

        exports: 'named',
        chunkFileNames: (chunk) => `${chunk.name}.${currentFormat === 'es' ? 'js' : 'cjs'}`,
        assetFileNames: (chunkInfo) => {
          console.log(chunkInfo.names)
          if (chunkInfo.names[0] === 'style.css') {
            return 'index.css'
          }
          return chunkInfo.names[0] as string
        },
      },
    },
  },
})
