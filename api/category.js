'use strict';

const config = require('../config');
const utils = require('../utils');

/**
 * Get all categories.
 */
let getHandler = (req, res) => {
  utils.getCollection('posts').then(({db, collection}) => {
    collection.distinct('category', (err, docs) => {
      res.send({
        status: 'ok',
        dataset: docs,
      });
      db.close();
    });

  }).catch(err => console.error(err))
}

module.exports = {
  get: getHandler,
}
