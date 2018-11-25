'use strict';

const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = env => ({
  mode: env === 'production' ? 'production' : 'development',
  entry: './index.jsx',
  output: {
    path: path.resolve('.', 'static'),
    publicPath: 'static/',
    filename: 'conartist.min.js',
    chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.(png|svg|gif|jpe?g)$/, loader: 'file-loader?name=images/[hash].[ext]!img-loader' },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: env === 'production'
          ? [
              MiniCssExtractPlugin.loader,
              'css-loader?modules=true&minimize=true',
              'postcss-loader',
            ]
          : [
              'style-loader',
              'css-modules-flow-types-loader',
              'css-loader?modules=true',
              'postcss-loader',
            ],
      },
      { test: /\.graphql$/, loader: 'graphql-tag/loader' },
      { test: /\.toml$/, loader: 'toml-loader' },
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'), // for react
      'process.env.API_URL': JSON.stringify('https://api.conartist.app'),
      'process.env.GRAPHQL_URL': JSON.stringify('https://graph.conartist.app'),
    }),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
  ] : [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('/api'),
      'process.env.GRAPHQL_URL': JSON.stringify('/api/v2'),
    }),
  ]
});
