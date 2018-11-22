'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = env => ({
  mode: env === 'production' ? 'production' : 'development',
  entry: './index.jsx',
  output: {
    path: path.resolve('.', 'static'),
    publicPath: 'static/',
    filename: 'conartist.min.js',
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.(png|svg|gif|jpe?g)$/, loader: 'file-loader?name=images/[hash].[ext]!img-loader' },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-modules-flow-types-loader!css-loader?modules=true&minimize=true!postcss-loader',
      },
      { test: /\.graphql$/, loader: 'graphql-tag/loader' },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  devtool: 'cheap-eval-source-map',
  optimization: {
    minimize: env === 'production',
  },
  plugins: env === 'production' ? [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  ] : []
});
