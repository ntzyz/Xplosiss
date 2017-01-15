'use strict';

const config = require('../config');
const utils = require('../utils');

/**
 * Get all tags.
 */
let getHandler = (req, res) => {
  utils.getCollection('posts').then(({db, collection}) => {
    let page = 0;
    let posts = [];
    let partton = {};

    if (req.query.page) {
      page = req.query.page - 1;
    }

    collection.distinct('tags', (err, docs) => {
      res.send({
        status: 'ok',
        dataset: docs.slice(page * config.pageSize, (page + 1) * config.pageSize),
        pages: {
          size: config.pageSize,
          current: page,
          count: Math.floor(docs.length / config.pageSize) + docs.length % config.pageSize === 0 ? 0 : 1,
        }
      });
      db.close();
    });

  }).catch(err => console.error(err))
}

module.exports = {
  get: getHandler,
}
