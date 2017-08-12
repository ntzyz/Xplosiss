const express = require('express');
const utils = require('../utils');

let router = express.Router();

/**
 * Get all tags from posts. Read only.
 */
router.get('/', async (req, res) => {
  let tags;
  try {
    tags = await utils.db.conn.collection('posts').distinct('tags');
  } catch (e) {
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
  let posts;
  try {
    posts = await utils.db.conn.collection('posts').find({ tags: req.params.tag }, { sort: [['date', 'desc' ]]}).toArray();
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }
  return res.send({
    status: 'ok',
    posts: utils.render(posts, { preview: true }),
  });
});

module.exports = router;