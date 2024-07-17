import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { nodeExternals } from 'rollup-plugin-node-externals';
import pkg from './package.json' assert { type: 'json' };

const config = {
  name: 'UnifiedWallet',
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
};

export default {
  input: 'src/index.tsx',
  output: [
    {
      // ES Modules: Modern browser imports

      // Browser usage:
      // <script type="module">
      //   import { func } from 'my-lib';
      //   func();
      // </script>

      // js/tsx file usage:
      // import { func } from 'my-lib';
      // func();
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    nodeExternals({
      // Specificially bundle react-use in
      exclude: /^react-use/,
    }),

    nodeResolve({ extensions: config.extensions }),

    commonjs(),
    babel({
      extensions: config.extensions,
      include: ['src/**/*'],
      exclude: 'node_modules/**',
    }),
  ],
};
