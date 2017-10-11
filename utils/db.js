const { MongoClient } = require('mongodb');
const config = require('../config');

let __conn = null;

/**
 * Connect to MongoDB and save the connection.
 */
function connect () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(config.database, (err, conn) => {
      if (err) {
        console.error(err);
        process.exit(10);
      } else {
        console.log('Database connected.');
        __conn = conn;
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
    return connect();
  }
};
