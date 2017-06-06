'use strict';

const config = require('../config');
const utils = require('../utils');

/**
 * Get all tags.
 */
let getHandler = (req, res) => {
  utils.db.collection('posts').distinct('tags', (err, docs) => {
    res.send({
      status: 'ok',
      dataset: docs,
    });
  });
}

module.exports = {
  get: getHandler,
}
