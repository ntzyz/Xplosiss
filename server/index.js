const express = require('express');
const utils = require('../utils');

let api = express.Router();

api.use(async (req, res, next) => {
  await utils.db.prepare();
  next();
});

api.use('/category', require('./category'));
api.use('/tag', require('./tag'));
api.use('/widget', require('./widget'));
api.use('/post', require('./post'));
api.use('/token', require('./token'));
api.use('/media', require('./media'));
api.use('/page', require('./page'));
api.use('/logs', require('./logs'));
api.use('/reply', require('./reply'));

module.exports = api;
