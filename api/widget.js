'use strict';

const config = require('../config');
const utils = require('../utils');

let getHandler = (req, res) => {
  utils.getCollection('widgets').then(({db, collection}) => {
    collection.find({enabled: true}).toArray((err, widgets) => {
      res.send({
        status: 'ok',
        dataset: widgets,
      });
      db.close();
    })
  });
};

module.exports = {
  get: getHandler
}