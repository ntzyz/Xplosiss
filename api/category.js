'use strict';

const config = require('../config');
const utils = require('../utils');

/**
 * Get all categories.
 */
let getHandler = (req, res) => {
  utils.db.collection('posts').distinct('category', (err, docs) => {
    res.send({
      status: 'ok',
      dataset: docs,
    });
  });
}

module.exports = {
  get: getHandler,
}
