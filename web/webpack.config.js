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
              'css-loader?modules=true',
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
  devtool: env === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
  optimization: {
    minimize: env === 'production',
    splitChunks: {
      minSize: 0,
      maxSize: 0,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      cacheGroups: {
        default: false,
        vendors: { // prevent creating 'vendors' chunks
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: () => false,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)/,
          name: 'react',
          chunks: 'all',
        },
        apollo: {
          test: /[\\/]node_modules[\\/](graphql|apollo-client|apollo-link|apollo-link-batch-http|apollo-cache|apollo-cache-inmemory|apollo-utilities|zen-observable|optimism)/,
          name: 'apollo',
          chunks: 'all',
          minSize: 0,
        },
        datefns: {
          test: /[\\/]node_modules[\\/](date-fns)/,
          name: 'date-fns',
          chunks: 'all',
          minSize: 0,
        },
        rxjs: {
          test: /[\\/]node_modules[\\/](rxjs)/,
          name: 'rxjs',
          chunks: 'all',
        },
      }
    }
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
