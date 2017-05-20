'use strict';

const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('.', 'src'),
    filename: 'index.min.js'
  },
  module: {
    rules: [
      { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' },
      { test: /\.s(a|c)ss$/, loader: 'style-loader!css-loader!postcss-loader!sass-loader' }
    ]
  }
};
