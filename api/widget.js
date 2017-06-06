'use strict';

const config = require('../config');
const utils = require('../utils');

let getHandler = (req, res) => {
  utils.db.collection('widgets').find({enabled: true}).toArray((err, widgets) => {
    res.send({
      status: 'ok',
      dataset: widgets,
    });
  })
};

module.exports = {
  get: getHandler
}