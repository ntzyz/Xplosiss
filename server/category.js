const express = require('express');
const utils = require('../utils');

let router = express.Router();

/**
 * Get all categories from posts. Read only.
 */
router.get('/', async (req, res) => {
  let categories;
  try {
    categories = await utils.db.conn.collection('posts').distinct('category');
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }
  return res.send({
    status: 'ok',
    categories,
  });
});

/**
 * Get all posts with the same category. Read only.
 */
router.get('/:category/posts', async (req, res) => {
  let posts;
  try {
    posts = await utils.db.conn.collection('posts').find({ category: req.params.category }, { sort: [['date', 'desc' ]]}).toArray();
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