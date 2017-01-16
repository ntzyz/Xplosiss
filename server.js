'use strict';

const express = require('express');
const config = require('./config');
const utils = require('./utils');
const fs = require('fs');

let server = express();

server.use(utils.logTool);

server.use('/api', require('./api/index'));

server.use(['/', '/category/*', '/tags/*', ], express.static('static'));

server.use((req, res, next) => {
  fs.readFile('static/index.html', 'UTF-8', (err, file) => {
    res.send(file);
  })
})

server.listen(config.port);
