'use strict';

const express = require('express');
const config = require('./config');
const utils = require('./utils');

let server = express();

server.use(utils.logTool);

server.use('/api', require('./api/index'));

server.use('/', express.static('static'));

server.listen(config.port);
