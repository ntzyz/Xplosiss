const express = require('express');
const utils = require('../utils');
const { ObjectID } = require('mongodb');
const config = require('../config');

const { eventBus } = utils;
let router = express.Router();

/**
 * Get posts list.
 */
router.get('/', async (req, res) => {
  let page = Math.max(req.query.page ? req.query.page - 1 : 0, 0);
  let pagesize = Number(req.query.pagesize) || config.page.size;
  let posts, count;
  try {
    let cursor = utils.db.conn.collection('posts').find(req.query.full === 'true' ? {} : {
      hideOnIndex: {
        $ne: true,
      }
    }, { sort: [['date', 'desc']] }).skip(page * pagesize).limit(pagesize);
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

  const options = {
    acceptLanguage: req.headers['accept-language']
  };

  if (req.query['title-only']) {
    options.titleOnly = true;
  } else {
    options.preview = true;
  }

  return res.send({
    status: 'ok',
    posts: utils.render(posts, options),
    page: {
      size: pagesize,
      max: Math.floor(count / pagesize) + (count % pagesize === 0 ? 0 : 1),
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
    post: utils.render([post], {
      preview: false,
      acceptLanguage: req.headers['accept-language'],
      password: req.query.password,
    })[0],
  });
});

/**
 * Create an comment on one post.
 */
router.put('/by-slug/:slug/reply', async (req, res) => {
  eventBus.emit(eventBus.EVENT_NEW_REPLY, {
    ipAddr: req.headers['x-real-ip'] || req.ip,
    userAgent: req.headers['user-agent'],
    postSlug: req.params.slug,
    user: req.body.user,
    email: '*hidden*',
    site: req.body.site,
    content: req.body.content,
  });

  try {
    await utils.db.conn.collection('posts').update(
      { slug: req.params.slug },
      { $push: { replies: {
        user: req.body.user,
        email: req.body.email,
        site: req.body.site,
        content: req.body.content,
        replyTo: req.body.replyTo,
        githubId: req.body.githubId,
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

  delete post.password;

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
        slug: req.body.slug,
        category: req.body.category,
        date: new Date(req.body.date),
        tags: req.body.tags,
        body: req.body.body,
        cover: req.body.cover,
        hideOnIndex: req.body.hideOnIndex,
        insertCover: req.body.insertCover,
        password: req.body.password,
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
    r = await utils.db.conn.collection('posts').insertOne({
      slug: req.body.slug,
      category: req.body.category,
      date: new Date(req.body.date),
      cover: req.body.cover,
      tags: req.body.tags,
      body: req.body.body,
      hideOnIndex: req.body.hideOnIndex,
      insertCover: req.body.insertCover,
      password: req.body.password,
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

  res.send({ status: 'ok', id: r.insertedId });
});

module.exports = router;
