'use strict';

const config = require('../config');
const utils = require('../utils');

/**
 * Get all tags.
 */
let getHandler = (req, res) => {
  utils.getCollection('posts').then(({db, collection}) => {

    collection.distinct('tags', (err, docs) => {
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
