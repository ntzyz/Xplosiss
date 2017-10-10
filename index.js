const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const utils = require('./utils');
const io = require('socket.io');

const isProd = process.env.NODE_ENV === 'production';

let site = express();

if (!isProd) {
  console.log('[WARN] You are now in development mode, HTTP header Access-Control-Allow-Origin will be set to *.');
  site.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
}

// disable 'x-powered-by' for security
site.disable('x-powered-by');

// parse application/x-www-form-urlencoded
site.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
site.use(bodyParser.json());

// print all access logs
site.use(utils.logger);

// API entry
site.use('/api', require('./server'));

// favicon
site.get('/favicon.ico', (req, res) => {
  if (config.favicon) {
    res.sendFile(config.favicon, { root: __dirname });
  } else {
    res.status(404).send('');
  }
});

require('./web/server')(site);

// Establish database connection and start http service
utils.db.prepare().then(() => {
  utils.websocket.attach(site);
  utils.websocket.server.listen(config.port, /*'localhost', */() => {
    console.log(`Server started on port ${config.port}`);
  });
})
