import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/main.js',
  output: [
    {
      cleanDir: true,
      dir: './dist/esm',
      format: 'esm',
      preserveModules: true,
      sourcemap: 'inline',
    },
    {
      cleanDir: true,
      dir: './dist/cjs',
      format: 'cjs',
      preserveModules: true,
      sourcemap: 'inline',
    },
  ]
});
