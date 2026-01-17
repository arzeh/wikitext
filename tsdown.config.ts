import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['./src/**/*.ts'],
    platform: 'node',
    dts: true,
    watch: './src',
    sourcemap: true,
    format: ['esm', 'cjs'],
    clean: true,
  },
])
