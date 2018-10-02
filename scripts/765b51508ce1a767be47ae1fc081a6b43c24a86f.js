/**
 * Before this commit, the HTTP Referer saveds into the 'logs' collection
 * were not valid. We need to drop them all.
 */

const { db } = require('../utils');

module.exports = async function () {
  await db.prepare();

  const collections = (await db.conn.listCollections().toArray()).map(coll => coll.name);

  if (collections.includes('logs')) {
    await db.conn.collection('logs').drop();
  }
};

