const express = require('express');
const utils = require('../utils');
const { ObjectID } = require('mongodb');
const config = require('../config');

let router = express.Router();

/**
 * Get posts list.
 */
router.get('/', async (req, res) => {
  let page = req.query.page ? req.query.page - 1 : 0;
  let posts, count;
  try {
    let cursor = utils.db.conn.collection('posts').find({}, { sort: [['date', 'desc']] }).skip(page * config.page.size).limit(config.page.size);
    posts = await cursor.toArray();
    count = await cursor.count();
  } catch (e) {
    /* istanbul ignore next */
    console.error(e);
    /* istanbul ignore next */
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  for (let post of posts) {
    delete post.replies;
  }

  return res.send({
    status: 'ok',
    posts: utils.render(posts, { preview: true }),
    page: {
      size: config.page.size,
      max: Math.floor(count / config.page.size) + (count % config.page.size === 0 ? 0 : 1),
      current: page + 1,
    }
  });
});

/**
 * Get post by it's slug
 */
router.get('/by-slug/:slug', async (req, res) => {
  let post;
  try {
    post = await utils.db.conn.collection('posts').findOne({ slug: req.params.slug });
  } catch (e) {
    /* istanbul ignore next */
    console.error(e);
    /* istanbul ignore next */
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  if (!post) {
    return res.status(404).send({
      status: 'error',
      message: utils.messages.ERR_NOT_FOUND,
    });
  }

  post.replies.forEach(reply => delete reply.email);

  return res.send({
    status: 'ok',
    post: utils.render([post], { preview: false })[0],
  });
});

/**
 * Create an comment on one post.
 */
router.put('/by-slug/:slug/reply', async (req, res) => {
  try {
    await utils.db.conn.collection('posts').update(
      { slug: req.params.slug },
      { $push: { replies: {
        user: req.body.user,
        email: req.body.email,
        site: req.body.site,
        content: req.body.content,
        datetime: new Date().getTime()
      }}}
    );
  } catch (e) {
    /* istanbul ignore next */
    console.error(e);
    /* istanbul ignore next */
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  return res.send({
    status: 'ok',
  });
});

/**
 * Get one post by it's id without rendering (for jobs like editing)
 */
router.get('/by-id/:id/raw', async (req, res) => {
  let post;
  try {
    post = await utils.db.conn.collection('posts').findOne({ _id: ObjectID(req.params.id) });
  } catch (e) {
    /* istanbul ignore next */
    console.error(e);
    /* istanbul ignore next */
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  if (!post) {
    return res.status(404).send({
      status: 'error',
      message: utils.messages.ERR_NOT_FOUND,
    });
  }

  return res.send({
    status: 'ok',
    post,
  });
});

/**
 * Update one post by it's id;
 */
router.post('/by-id/:id', async (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(403).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  try {
    await utils.db.conn.collection('posts').findAndModify(
      { _id: ObjectID(req.params.id) },
      [],
      { $set: {
        title: req.body.title,
        slug: req.body.slug,
        category: req.body.category,
        date: new Date(req.body.date),
        tags: req.body.tags,
        content: req.body.content,
        cover: req.body.cover,
      }}
    );
  } catch (e) {
    /* istanbul ignore next */
    console.error(e);
    /* istanbul ignore next */
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL,
    });
  }

  res.send({ status: 'ok' });
});

/**
 * Delete one post by it's id.
 */
router.delete('/by-id/:id', async (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(403).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  try {
    await utils.db.conn.collection('posts').deleteOne(
      { _id: ObjectID(req.params.id) }
    );
  } catch (e) {
    /* istanbul ignore next */
    console.error(e);
    /* istanbul ignore next */
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL,
    });
  }

  res.send({ status: 'ok' });
});

/**
 * Create a new post.
 */
router.put('/', async (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(403).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  let r;
  try {
    r = await utils.db.conn.collection('posts').insert({
      title: req.body.title,
      slug: req.body.slug,
      category: req.body.category,
      date: new Date(req.body.date),
      tags: req.body.tags,
      content: req.body.content,
      replies: [],
    });
  } catch (e) {
    /* istanbul ignore next */
    console.error(e);
    /* istanbul ignore next */
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL,
    });
  }

  res.send({ status: 'ok', id: r.insertedIds[0] });
});

module.exports = router;
