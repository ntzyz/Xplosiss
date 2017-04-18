'use strict';

const { MongoClient } = require('mongodb');
const config = require('./config');

let getCollection = (name) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(config.dbUrl, (err, db) => {
      if (err) {
        reject(err);
      }
      else {
        resolve({
          db,
          collection: db.collection(name)
        });
      }
    });
  })
}

let logTool = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.headers['x-real-ip'] || req.ip} - ${req.method} ${req.url} - ${req.headers['user-agent']}`);
  next();
}

module.exports = {
  getCollection, logTool
}
