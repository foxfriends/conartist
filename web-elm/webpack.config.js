'use strict';
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve('.'),
    filename: 'conartist.min.js',
  },
  module: {
    rules: [
      { test: /\.elm$/, loader: 'elm-webpack-loader', exclude: /(elm-stuff|node_modules)/ },
      { test: /\.(sass|s?css)$/, exclude: /(elm-stuff|node_modules)/, use:
        ExtractTextPlugin.extract({
          use: 'css-loader?minimize=true!postcss-loader!fast-sass-loader',
        }) },
    ],
    noParse: /\.elm$/,
  },
  plugins: [
    new UglifyJSPlugin(),
    new ExtractTextPlugin({
      filename: 'conartist.min.css',
    }),
  ]
};
