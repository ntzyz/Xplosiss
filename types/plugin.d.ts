import express from 'express';

import utils from '../utils';
import './config';

declare global {
  interface PluginOptions {
    site: express.Router
    utils: typeof utils
    config: BlogConfig
  }
  
  type clientPluginInstaller = (options: PluginOptions) => void;
}
export {};
