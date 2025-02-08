import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['src/index.ts'],
  sourcemap: true,
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  outExtension({ format }) {
    return format === 'esm' ? { js: '.mjs' } : { js: '.js' };
  },
});
