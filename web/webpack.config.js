'use strict';
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve('.', 'static'),
    filename: 'conartist.min.js',
  },
  module: {
    rules: [
      { test: /\.(png|svg|gif|jpe?g)$/, loader: 'file-loader?name=images/[hash].[ext]!img-loader' },
      { test: /\.(sass|s?css)$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader?minimize=true!postcss-loader!fast-sass-loader',
        }),
      },
    ],
  },
  plugins: [
    new UglifyJSPlugin(),
    new ExtractTextPlugin({
      filename: 'conartist.min.css',
    }),
  ]
};
