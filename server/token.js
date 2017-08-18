const express = require('express');
const utils = require('../utils');
const config = require('../config');

let router = express.Router();

router.get('/forgot', (req, res) => {
  console.log(`Your access token is ${utils.token}`);
  res.send({ status: 'ok' });
})

router.get('/check', (req, res) => {
  res.send({
    status: 'ok',
    result: (req.query.token ? req.query.token === utils.token : false)
  });
})

module.exports = router;
