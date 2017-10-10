const express = require('express');
const utils = require('../utils');
const config = require('../config');

let router = express.Router();

/**
 * Get lastest five replies
 */
router.get('/latest', async (req, res) => {
  let postReplies, pageReplies;

  try {
    postReplies = await utils.db.conn.collection('posts').aggregate([
      { $project: { slug: 1, title: 1, 'replies.datetime': 1, 'replies.user': 1 }},
      { $unwind: '$replies' },
      { $sort: {'replies.datetime': -1} },
      { $addFields: { path: 'post' } },
      { $limit: 5 }
    ]).toArray();
    pageReplies = await utils.db.conn.collection('pages').aggregate([
      { $project: { slug: 1, title: 1, 'replies.datetime': 1, 'replies.user': 1 }},
      { $unwind: '$replies' },
      { $sort: {'replies.datetime': -1} },
      { $addFields: { path: 'page' } },
      { $limit: 5 }
    ]).toArray();
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  let replies = [...postReplies, ...pageReplies];
  replies.sort((a, b) => b.replies.datetime > a.replies.datetime);

  return res.send({
    status: 'ok',
    replies
  });
});

module.exports = router;
