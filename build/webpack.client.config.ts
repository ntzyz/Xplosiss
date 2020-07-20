import * as path from 'path';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import base from './webpack.base.config';
import * as VueSSRClientPlugin from 'vue-server-renderer/client-plugin';
import * as MiniCssExtractPlugin  from 'mini-css-extract-plugin';

const webpackClientConfig = merge(base, {
  entry: path.resolve(__dirname, '../src/entry-client'),
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
  },
  plugins: [
    new VueSSRClientPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ]
});

if (process.env.NODE_ENV === 'production') {
  webpackClientConfig.devtool = '#source-map';
}

export default webpackClientConfig;
