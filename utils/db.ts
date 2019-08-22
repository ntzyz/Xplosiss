import * as mongodb from 'mongodb';
import config from '../config';

const MongoClient = mongodb.MongoClient;

let __conn: mongodb.Db = null;
let promise: Promise<void> = null;

/**
 * Connect to MongoDB and save the connection.
 */
async function connect () {
  try {
    const server = await MongoClient.connect(config.database.address, { useNewUrlParser: true });
    __conn = server.db(config.database.db);

    console.log('Database connected.');
  } catch (err) {
    console.error(err);
    process.exit(10);
  }
}

export default {
  /**
   * Get the database connection.
   */
  get conn (): mongodb.Db {
    return __conn;
  },
  /**
   * Connect to the database.
   */
  prepare () : Promise<void> {
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
