'use strict';

const express = require('express');
const config = require('./config');

let server = express();

server.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
})

server.get('/api', (req, res) => {
  res.send({
    status: 'ok',
  });
})

server.use('/', express.static('static'));

server.listen(config.port);
