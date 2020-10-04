import express from 'express';

import utils from '../utils';
import config from '../config';

export interface PluginOptions {
  site: express.Router,
  utils: typeof utils,
  config: typeof config
};

export type clientPluginInstaller = (options: PluginOptions) => void;
