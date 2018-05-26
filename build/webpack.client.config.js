const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = merge(base, {
  entry: path.resolve(__dirname, '../src/entry-client'),
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   minChunks: Infinity
    // }),
    new VueSSRClientPlugin()
  ]
});

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
}
