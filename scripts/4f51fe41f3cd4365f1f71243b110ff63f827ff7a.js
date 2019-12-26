/**
 * Before this commit, all posts will insert it's cover to article, now we add a
 * option for this feature. In order to keep blog works as usual, we need to enable
 * this feature for all old posts.
 */

const { db } = require('../utils');

module.exports = async function () {
  await db.prepare();

  await db.conn.collection('posts').updateMany(
    { cover: { $nin: [ '', undefined ] } },
    { $set: { insertCover: true } }
  );
};

