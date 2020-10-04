import express from 'express';
import utils from '../utils';

import category from './category';
import tag from './tag';
import widget from './widget';
import post from './post';
import token from './token';
import media from './media';
import page from './page';
import logs from './logs';
import reply from './reply';

const api = express.Router();

api.use(async (req, res, next) => {
  await utils.db.prepare();
  next();
});

api.use('/category', category);
api.use('/tag', tag);
api.use('/widget', widget);
api.use('/post', post);
api.use('/token', token);
api.use('/media', media);
api.use('/page', page);
api.use('/logs', logs);
api.use('/reply', reply);

export default api;
