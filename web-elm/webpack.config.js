'use strict';

const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve('.'),
    filename: 'conartist.min.js',
  },
  module: {
    rules: [
      { test: /\.elm$/, exclude: /(elm-stuff|node_modules)/, loader: 'elm-webpack-loader' },
    ],
  },
};
