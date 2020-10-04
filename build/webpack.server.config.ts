import path from 'path';
import { merge } from 'webpack-merge';
import base from './webpack.base.config';
import VueSSRServerPlugin from 'vue-server-renderer/server-plugin';
import nodeExternals from 'webpack-node-externals';

const webpackServerConfig = merge(base, {
  target: 'node',
  devtool: '#source-map',
  entry: path.resolve(__dirname, '../src/entry-server.js'),
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    // @ts-ignore 
    allowlist: /\.(sa|sc|c)ss$/
  }),
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'null-loader'
        ],
      },
    ]
  },
  plugins: [
    new VueSSRServerPlugin()
  ]
});

export default webpackServerConfig;
