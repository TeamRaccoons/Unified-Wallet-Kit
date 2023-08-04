const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports = function webpackConfig(env, args) {
  return {
    entry: path.join(__dirname, 'src/index.tsx'),
    output: {
      filename: 'index.js',
      path: path.join(__dirname, 'dist'),
      libraryTarget: 'commonjs',
    },
    resolve: { extensions: ['.tsx', '.ts', '.js'] },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          // See .babelrc for further babel config
        },
      ],
    },
    optimization: {
      minimizer: [
        // Omit creation of .txt files
        // new (require('terser-webpack-plugin'))({ extractComments: false }),
      ],
    },
    plugins: [new CleanWebpackPlugin()],
    externals: [nodeExternals()],
  }
}
