import express from 'express';
import utils from '../utils';

let router = express.Router();

/**
 * Get lastest five replies
 */
router.get('/latest', async (req, res) => {
  let postReplies, pageReplies;

  try {
    postReplies = await utils.db.conn.collection('posts').aggregate([
      { $project: { slug: 1, body: 1, 'replies.datetime': 1, 'replies.user': 1, 'replies.deleted': 1 }},
      { $unwind: '$replies' },
      { $match: { 'replies.deleted': { $ne: true } } },
      { $sort: { 'replies.datetime': -1 }},
      { $addFields: { path: 'post' }},
      { $limit: 5 }
    ]).toArray();
    postReplies = utils.render(postReplies, { fakeRendering: true });

    pageReplies = await utils.db.conn.collection('pages').aggregate([
      { $project: { slug: 1, title: 1, 'replies.datetime': 1, 'replies.user': 1, 'replies.deleted': 1 }},
      { $unwind: '$replies' },
      { $match: { 'replies.deleted': { $ne: true } } },
      { $sort: { 'replies.datetime': -1 }},
      { $addFields: { path: 'page' }},
      { $limit: 5 }
    ]).toArray();
  } catch (e) {
    /* istanbul ignore next */
    console.error(e);
    /* istanbul ignore next */
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  let replies = [...postReplies, ...pageReplies];
  replies.sort((a, b) => b.replies.datetime - a.replies.datetime);

  return res.send({
    status: 'ok',
    replies
  });
});

export default router;
