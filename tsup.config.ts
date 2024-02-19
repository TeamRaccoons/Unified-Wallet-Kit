import { defineConfig } from 'tsup';
import babel from 'esbuild-plugin-babel';

export default defineConfig((options) => ({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  target: 'node18',
  splitting: true,
  sourcemap: true,
  minify: false,
  esbuildPlugins: [babel() as any],
  clean: true,
  skipNodeModulesBundle: true,
  dts: true,
  external: ['node_modules'],
}));
