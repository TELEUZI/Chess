import { join, resolve as _resolve } from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(
  import.meta.url));

const devServer = (isDev) => !isDev ? {} : {
  devServer: {
    open: true,
    hot: true,
    port: 8080,
    contentBase: join(__dirname, 'public'),
  },
};

const esLintPlugin = (isDev) => isDev ? [] : [new ESLintPlugin({ extensions: ['ts', 'js', 'cjs'] })];

export default ({ development }) => ({
  mode: development ? 'development' : 'production',
  devtool: development ? 'inline-source-map' : false,
  entry: {
    main: './src/app.ts',
  },
  output: {
    filename: 'index.js',
    path: _resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext]',
  },
  module: {
    rules: [{
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
    new NodePolyfillPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  ...devServer(development)
});
