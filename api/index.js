'use strict';

const express = require('express');
const utils = require('../utils');
const post = require('./post');
const category = require('./category');
const tag = require('./tag');
const common = require('./common');
const login = require('./login');
const widget = require('./widget');

let router = express.Router();

// API root.
router.get('/', (req, res) => {
  res.send({
    status: 'ok',
    version: '1.0',
    versions: ['1.0']
  })
});

// public api
router.get('/common', common.get);
router.get('/post', post.get);
router.get('/tag', tag.get);
router.get('/category', category.get);
router.get('/widget', widget.get);

// authorization-required api
router.use(utils.authTool);
router.put('/common', common.put);
router.post('/post', post.post);

module.exports = router;
