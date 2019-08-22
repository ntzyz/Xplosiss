import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import base from './webpack.base.config';
import * as VueSSRClientPlugin from 'vue-server-renderer/client-plugin';

const webpackClientConfig = merge(base, {
  entry: path.resolve(__dirname, '../src/entry-client'),
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
  },
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
  },
  plugins: [
    new VueSSRClientPlugin()
  ]
});

if (process.env.NODE_ENV === 'production') {
  webpackClientConfig.devtool = '#source-map';
}

export default webpackClientConfig;
