var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const devServer = (isDev) =>
  !isDev
    ? {}
    : {
        devServer: {
          open: true,
          hot: true,
          port: 8085,
          contentBase: path.join(__dirname, 'public'),
        },
      };

const esLintPlugin = (isDev) =>
  isDev ? [] : [new ESLintPlugin({ extensions: ['ts', 'js', 'cjs'] })];

module.exports = ({ development }) => ({
  mode: 'production',
  devtool: development ? 'inline-source-map' : false,
  entry: {
    main: './src/index.ts',
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext]',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    ...esLintPlugin(development),
    new NodePolyfillPlugin(),
    new webpack.EnvironmentPlugin({
      JWT_SECRET: 'c8589464-0b84-4b6a-a849-4e8572324dc4',
      JWT_EXPIRES_IN: '1d'
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  ...devServer(development),
});
