const fs = require('fs');
const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');

const { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin } = require('webpack');
const { GlobCopyWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AotPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ['common','polyfills','vendor','app','test'];
const minimizeCss = false;
const baseHref = '';
const deployUrl = '';

const chunkSortMode = function (left, right) {
    const leftIndex = entryPoints.indexOf(left.names[0]);
    const rightIndex = entryPoints.indexOf(right.names[0]);
    return leftIndex - rightIndex;
};

module.exports = {
  'resolve': {
    'extensions': [
      '.ts',
      '.js'
    ],
    'modules': [
      './node_modules'
    ],
    'symlinks': true
  },
  'resolveLoader': {
    'modules': [
      './node_modules'
    ]
  },
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts',
    'test': './src/test.ts',
  },
  output: {
    path: path.resolve('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
  },
  'module': {
    'rules': [
      {
        'enforce': 'pre',
        'test': /\.js$/,
        'loader': 'source-map-loader',
        'exclude': [
          /\/node_modules\//
        ]
      },
      {
        'test': /\.json$/,
        'loader': 'json-loader'
      },
      {
        'test': /\.html$/,
        'loader': 'raw-loader'
      },
      {
        'test': /\.(eot|svg)$/,
        'loader': 'file-loader?name=[name].[hash:20].[ext]'
      },
      {
        'test': /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|cur|ani)$/,
        'loader': 'url-loader?name=[name].[hash:20].[ext]&limit=10000'
      },
      {
        test: /\.s(c|a)ss$/,
        exclude: /\.component\.s(c|a)ss$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
      },
      {
        test: /\.component\.s(c|a)ss$/,
        include: path.resolve('src', 'app'),
        loader: 'raw-loader!postcss-loader!sass-loader'
      },
      {
        test: /\.css$/,
        exclude: path.resolve('src', 'app'),
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.css$/,
        include: path.resolve('src', 'app'),
        loader: 'raw-loader!postcss-loader'
      },
      {
        test: /(\.spec\.ts|test.ts)$/,
        loaders: [
          'mocha-loader',
          '@ngtools/webpack'
        ],
      },
      {
        'test': /\.ts$/,
        'loader': '@ngtools/webpack'
      }
    ]
  },
  'plugins': [
    // new NoEmitOnErrorsPlugin(),
    new GlobCopyWebpackPlugin({
      'patterns': [
        'assets'
      ],
      'globOptions': {
        'cwd': path.join(process.cwd(), 'src'),
        'dot': true,
        'ignore': '**/.gitkeep'
      }
    }),
    new ProgressPlugin(),
    new SourceMapDevToolPlugin({
      'filename': '[file].map[query]',
      'moduleFilenameTemplate': '[resource-path]',
      'fallbackModuleFilenameTemplate': '[resource-path]?[hash]',
      'sourceRoot': 'webpack:///'
    }),
    new HtmlWebpackPlugin({
      'template': './src/index.html',
      'filename': './index.html',
      'hash': false,
      'inject': true,
      'compile': true,
      'favicon': false,
      'minify': false,
      'cache': true,
      'showErrors': true,
      'chunks': 'all',
      'excludeChunks': ['test'],
      'xhtml': true,
      'chunksSortMode': chunkSortMode
    }),
    new HtmlWebpackPlugin({
      'template': './src/test.html',
      'filename': './test.html',
      'hash': false,
      'inject': true,
      'compile': true,
      'favicon': false,
      'minify': false,
      'cache': true,
      'showErrors': true,
      'chunks': 'all',
      'excludeChunks': ['app'],
      'xhtml': true,
      'chunksSortMode': chunkSortMode
    }),
    new BaseHrefWebpackPlugin({}),
    new CommonsChunkPlugin({
      'minChunks': 2,
      'name': 'common'
    }),
    new NamedModulesPlugin({}),
    new AotPlugin({
      'mainPath': 'main.ts',
      'hostReplacementPaths': {
        'environments/environment.ts': 'environments/environment.ts'
      },
      'exclude': [],
      'tsConfigPath': 'src/tsconfig.json',
      'skipCodeGeneration': true
    })
  ],
  'node': {
    'fs': 'empty',
    'global': true,
    'crypto': 'empty',
    'tls': 'empty',
    'net': 'empty',
    'process': true,
    'module': false,
    'clearImmediate': false,
    'setImmediate': false
  }
};
