/**
 * Before this commit, each post only provide one copy of { title, content },
 * But now we need to support multiple language version of post
 */

const { db } = require('../utils');
const { ObjectID } = require('mongodb');

module.exports = async function () {
  await db.prepare();

  const posts = await db.conn.collection('posts').find({}, { _id: true }).toArray();

  for (const iterator of posts) {
    const post = await db.conn.collection('posts').findOne({
      _id: ObjectID(iterator._id),
    });

    const body = [
      {
        title: post.title,
        content: post.content.content,
        language: 'zh',
        format: post.content.encoding,
        default: true,
      }
    ];

    await db.conn.collection('posts').findOneAndUpdate({
      _id: ObjectID(iterator._id),
    }, {
      $set: { body },
      $unset: { title: '', content: '' },
    });

    console.log(':: Updated: ', post.title);
  }
};

