const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const utils = require('./utils');

let site = express();

// parse application/x-www-form-urlencoded
site.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
site.use(bodyParser.json());

// API entry
site.use('/api', require('./server'));

// 404
site.use((req, res, next) => {
  res.send('Ooops. Not found.');
});

// Establish database connection and start http service
utils.db.prepare().then(() => {
  site.listen(config.port, /*'localhost', */() => {
    console.log(`Server started on port ${config.port}`);
  });
})
