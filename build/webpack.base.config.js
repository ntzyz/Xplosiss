const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const config = require('../config');
const { VueLoaderPlugin } = require('vue-loader');
const child_process = require('child_process');

const clientConfig = {
  title: config.title,
  subtitle: config.subtitle,
  avatar: config.avatar,
  url: config.url,
  footer: config.footer,
  api: {
    url: config.url + '/api'
  },
  components: config.components,
  meta: config.meta,
  plugins: config.plugins,
};

fs.writeFileSync(path.join(__dirname, '../src/config.json'), JSON.stringify(clientConfig));

let commit = null;
try {
  commit = child_process.execSync('git log -1 --format="%h"').toString().trim();
} catch (e) {
  commit = 'unknown';
}

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: [ '.js', '.ts' ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
  },
  performance: {
    hints: false
  },
  mode: 'development',
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.COMMIT': JSON.stringify(commit),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    new webpack.IgnorePlugin(/(server|\.md$)/, /plugins/),
    new VueLoaderPlugin(),
  ]
};

if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = '#source-map';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]);
  module.exports.mode = 'production';
}
