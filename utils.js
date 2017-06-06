'use strict';

const { MongoClient } = require('mongodb');
const config = require('./config');
const fs = require('fs');

let conn = null;
MongoClient.connect(config.dbUrl, (err, _conn) => {
  if (err) {
    console.log(err);
    process.exit(10);
  } else {
    conn = _conn;
  }
})

let logTool = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.headers['x-real-ip'] || req.ip} - ${req.method} ${req.url} - ${req.headers['user-agent']}`);
  next();
}

let authTool = (function() {
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
  let token = new Array(25).fill(0).map(() => {
    return possible[Math.floor(Math.random() * possible.length)];
  }).join('');

  console.log('Your management token is: ' + token);
  console.log(`In case you forget this token, just restart the server, or find it in /var/run/user/${process.getuid()}/hardcode-token`);

  fs.writeFile(`/var/run/user/${process.getuid()}/hardcode-token`, token, (err) => {err && console.log(err)});

  return (req, res, next) => {
    if (req.query.token !== token) {
      res.status(403).send({
        status: 'fucked up',
        message: 'forbidden'
      });
    } else {
      next();
    }
  }
})();

module.exports = {
  logTool, authTool,
  get db () {
    return conn;
  }
}
