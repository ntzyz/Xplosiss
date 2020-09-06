import * as express from 'express';
import utils from '../utils';
import config from '../config';

let router = express.Router();

/**
 * Get all tags from posts. Read only.
 */
router.get('/', async (req, res) => {
  let tags;
  try {
    tags = await utils.db.conn.collection('posts').aggregate([
      { $match: { tags: { $not: { $size: 0 }}}},
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 }}},
      { $project: { _id: 0, tag: '$_id', count: '$count' }},
      { $sort: { count: -1 }}
    ]).toArray();
  } catch (e) {
    /* istanbul ignore next */
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }
  return res.send({
    status: 'ok',
    tags,
  });
});

/**
 * Get all posts with the same tag. Read only.
 */
router.get('/:tag/posts', async (req, res) => {
  let page = Math.max(req.query.page ? Number(req.query.page) - 1 : 0, 0);
  let posts, count;
  try {
    let cursor = utils.db.conn.collection('posts').find({ tags: req.params.tag }, { sort: { data: -1 } }).skip(page * config.page.size).limit(config.page.size);
    posts = await cursor.toArray();
    count = await cursor.count();
  } catch (e) {
    /* istanbul ignore next */
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  for (let post of posts) {
    delete post.replies;
  }

  if (posts.length === 0) {
    return res.status(404).send({
      status: 'error',
      message: 'the specified resources cannot be found on this server.'
    });
  }

  return res.send({
    status: 'ok',
    posts: utils.render(posts, { preview: true, acceptLanguage: req.headers['accept-language'] }),
    page: {
      size: config.page.size,
      max: Math.floor(count / config.page.size) + (count % config.page.size === 0 ? 0 : 1),
      current: page + 1,
    }
  });
});

export default router;
