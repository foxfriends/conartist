'use strict';

const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PROD = 'production'; // production environment
const STAGING = 'staging'; // staging environment: looks like production, but different backend

module.exports = env => {
  const plugins = [new MiniCssExtractPlugin({ filename: '[name].css' })];
  switch (env) {
    case PROD:
      plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'), // for react
        'process.env.API_URL': JSON.stringify('https://api.conartist.app'),
        'process.env.GRAPHQL_URL': JSON.stringify('https://graph.conartist.app'),
        'process.env.SUPPORT_EMAIL': JSON.stringify('support@conartist.app'),
        'process.env.DONATE_URL': JSON.stringify('https://ko-fi.com/foxfriends'),
        'process.env.REPOSITORY_URL': JSON.stringify('https://github.com/foxfriends/conartist'),
        'process.env.APP_STORE_URL': JSON.stringify('https://itunes.apple.com/us/app/conartist/id1448972207'),
        'process.env.DISCORD_URL': JSON.stringify('https://discordapp.com/invite/kh9hmt3'),
        'process.env.CON_REQUEST_URL': JSON.stringify('https://github.com/foxfriends/conartist/blob/master/dev/import-conventions/sample/convention.toml'),
      }));
      break;
    case STAGING:
      plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'), // for react
        'process.env.API_URL': JSON.stringify('https://api.staging.conartist.app'),
        'process.env.GRAPHQL_URL': JSON.stringify('https://graph.staging.conartist.app'),
        'process.env.SUPPORT_EMAIL': JSON.stringify('support@staging.conartist.app'),
        'process.env.DONATE_URL': JSON.stringify('https://ko-fi.com/foxfriends'),
        'process.env.REPOSITORY_URL': JSON.stringify('https://github.com/foxfriends/conartist'),
        'process.env.APP_STORE_URL': JSON.stringify('https://itunes.apple.com/us/app/conartist/id1448972207'),
        'process.env.DISCORD_URL': JSON.stringify('https://discordapp.com/invite/kh9hmt3'),
        'process.env.CON_REQUEST_URL': JSON.stringify('https://github.com/foxfriends/conartist/blob/master/dev/import-conventions/sample/convention.toml'),
      }));
      break;
    default:
      plugins.push(new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify('/api'),
        'process.env.GRAPHQL_URL': JSON.stringify('/api/v2'),
        'process.env.SUPPORT_EMAIL': JSON.stringify('support@staging.conartist.app'),
        'process.env.DONATE_URL': JSON.stringify('https://ko-fi.com/foxfriends'),
        'process.env.REPOSITORY_URL': JSON.stringify('https://github.com/foxfriends/conartist'),
        'process.env.APP_STORE_URL': JSON.stringify('https://itunes.apple.com/us/app/conartist/id1448972207'),
        'process.env.DISCORD_URL': JSON.stringify('https://discordapp.com/invite/kh9hmt3'),
        'process.env.CON_REQUEST_URL': JSON.stringify('https://github.com/foxfriends/conartist/blob/master/dev/import-conventions/sample/convention.toml'),
      }));
      break;
  }

  return {
    mode: env === PROD || env === STAGING ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      path: env === STAGING ? path.resolve('./', 'public_html', 'staging', 'static') : path.resolve('.', 'public_html', 'static'),
      publicPath: 'static/',
      filename: 'conartist.min.js',
      chunkFilename: '[name].bundle.js',
    },
    module: {
      rules: [
        { test: /\.md$/, use: ['html-loader', { loader: 'markdown-loader', options: { smartypants: true } }] },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        { test: /\.(woff2?)$/, use: [{ loader: 'file-loader', options: { name: 'fonts/[hash].[ext]' } }] },
        { test: /\.(png|svg|gif|jpe?g)$/, use: [{ loader: 'file-loader', options: { name: 'images/[hash].[ext]' } }, 'img-loader'] },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: env === PROD || env === STAGING
            ? [
                MiniCssExtractPlugin.loader,
                { loader: 'css-loader', options: { modules: true } },
                'postcss-loader',
              ]
            : [
                MiniCssExtractPlugin.loader,
                'css-modules-flow-types-loader',
                { loader: 'css-loader', options: { modules: true } },
                'postcss-loader',
              ],
        },
        { test: /\.graphql$/, loader: 'graphql-tag/loader' },
        { test: /\.toml$/, loader: 'toml-loader' },
      ],
    },
    resolve: {
      extensions: ['.js', '.json'],
    },
    devtool: env === PROD || env === STAGING ? 'source-map' : 'cheap-module-source-map',
    optimization: {
      minimize: env === PROD || env === STAGING,
    },
    plugins,
  }
}
