const { MongoClient } = require('mongodb');
const config = require('../config');

let __conn = null;
let promise = null;

/**
 * Connect to MongoDB and save the connection.
 */
function connect () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(config.database.address, (err, server) => {
      if (err) {
        console.error(err);
        process.exit(10);
      } else {
        console.log('Database connected.');
        __conn = server.db(config.database.db);
        resolve();
      }
    });
  });
}

module.exports = {
  /**
   * Get the database connection.
   */
  get conn () {
    return __conn;
  },
  /**
   * Connect to the database.
   */
  prepare () {
    if (!__conn) {
      if (!promise) {
        promise = connect();
      }
      return promise;
    } else {
      return Promise.resolve();
    }
  }
};
