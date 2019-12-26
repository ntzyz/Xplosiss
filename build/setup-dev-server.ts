/* istanbul ignore file */

import * as fs from 'fs';
import * as path from 'path';
import MFS = require('memory-fs');
import * as webpack from 'webpack';
import * as express from 'express';

import clientConfig from './webpack.client.config';
import serverConfig from './webpack.server.config';
import { BundleRenderer } from 'vue-server-renderer';

const readFile = (fs: MFS, file: string) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8');
  } catch (e) {
    // doing nothing...
  }
};

function setupDevServer (app: express.Application, templatePath: string, callback: (bundle: BundleRenderer, options: { template: string; clientManifest: any }) => void) {
  let bundle: BundleRenderer;
  let template: string;
  let clientManifest: any;
  let ready: () => void;

  const readyPromise: Promise<void> = new Promise(r => { ready = r; });
  const update = () => {
    if (bundle && clientManifest) {
      ready();
      callback(bundle, { template, clientManifest });
    }
  };

  template = fs.readFileSync(templatePath, 'utf-8');
  // TODO: Watch this file.

  if (typeof clientConfig.entry === 'string') {
    clientConfig.entry = ['webpack-hot-middleware/client', clientConfig.entry];
  }

  clientConfig.output.filename = '[name].js';
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

  const clientCompiler = webpack(clientConfig);
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  });

  app.use(devMiddleware);
  clientCompiler.plugin('done', stats => {
    stats = stats.toJson();
    stats.errors.forEach((err: Error) => console.error(err));
    stats.warnings.forEach((err: Error) => console.warn(err));
    if (stats.errors.length) return;
    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      'vue-ssr-client-manifest.json'
    ));
    update();
  });

  app.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }));

  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    
    const jsonStats = stats.toJson();
    if (jsonStats.errors.length) return;

    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));
    update();
  });

  return readyPromise;
}

export default setupDevServer;
