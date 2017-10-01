'use strict';
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('.'),
    filename: 'index.min.js',
  },
  module: {
    rules: [
      { test: /\.(sass|s?css)$/,
        exclude: /(node_modules)/,
        loader: 'style-loader!css-loader?minimize=true!postcss-loader!fast-sass-loader',
      },
    ],
  },
  plugins: [
    new UglifyJSPlugin(),
  ]
};
