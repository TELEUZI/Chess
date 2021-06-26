const path = require('path');

module.exports = {
  entry: './src/app.ts',
  module: {
    rules: [{
      test: [/\.tsx?$/],
      use: ['ts-loader'],
      exclude: /node_modules/,
    }, {
      test: /.scss$|.css/,
      exclude: [/node_modules/],
      use: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /.(?:ico|gif|png|jpg|svg)$/,
      type: 'asset/resource',
    }],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, ''),
    compress: true,
    port: 4000,
  },
};
