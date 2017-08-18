const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const utils = require('./utils');

let site = express();

// disable 'x-powered-by' for security
site.disable('x-powered-by');

// parse application/x-www-form-urlencoded
site.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
site.use(bodyParser.json());

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

site.use(express.static('web'));

site.use((req, res) => {
  res.sendFile('./web/index.html', { root: __dirname });
});

// Establish database connection and start http service
utils.db.prepare().then(() => {
  site.listen(config.port, /*'localhost', */() => {
    console.log(`Server started on port ${config.port}`);
  });
})
