'use strict';

const path = require('path');

const _module = {
  rules: [
    { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' },
    { test: /\.s(a|c)ss$/, loader: 'style-loader!css-loader!postcss-loader!sass-loader' }
  ]
};

module.exports = [{
  entry: './src/app/index.js',
  output: {
    path: path.resolve('.', 'public_html', 'app'),
    filename: 'index.min.js'
  },
  module: _module
}, {
  entry: './src/dashboard/index.js',
  output: {
    path: path.resolve('.', 'public_html', 'dashboard'),
    filename: 'index.min.js'
  },
  module: _module
}, {
  entry: './src/sign-in/index.js',
  output: {
    path: path.resolve('.', 'public_html'),
    filename: 'index.min.js'
  },
  module: _module
}];
