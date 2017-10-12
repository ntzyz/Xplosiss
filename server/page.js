const express = require('express');
const utils = require('../utils');
const { ObjectID } = require('mongodb');

let router = express.Router();

/**
 * Get all custom pages
 */
router.get('/', async (req, res) => {
  let pages;
  try {
    let cursor = utils.db.conn.collection('pages').find({});
    pages = await cursor.toArray();
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  for (let page of pages) {
    delete page.content;
  }

  return res.send({
    status: 'ok',
    pages: pages,
  });
});

/**
 * Get one custom page by it's slug
 */
router.get('/by-slug/:slug', async (req, res) => {
  let page;
  try {
    page = await utils.db.conn.collection('pages').findOne({ slug: req.params.slug });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  if (!page) {
    return res.status(404).send({
      status: 'error',
      message: utils.messages.ERR_NOT_FOUND,
    });
  }

  return res.send({
    status: 'ok',
    page: utils.render([page], { preview: false })[0],
  });
});

/**
 * Get one custom page by it's id without rendering (for jobs like editing)
 */
router.get('/by-id/:id/raw', async (req, res) => {
  let page;
  try {
    page = await utils.db.conn.collection('pages').findOne({ _id: ObjectID(req.params.id) });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  if (!page) {
    return res.status(404).send({
      status: 'error',
      message: utils.messages.ERR_NOT_FOUND,
    });
  }

  return res.send({
    status: 'ok',
    page,
  });
});

/**
 * Update one custom page by it's id.
 */
router.post('/by-id/:id', async (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(403).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  try {
    await utils.db.conn.collection('pages').findAndModify(
      { _id: ObjectID(req.params.id) },
      [],
      { $set: {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
      }}
    );
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL,
    });
  }

  res.send({ status: 'ok' });
});

/**
 * Delete one custom page by it's id.
 */
router.delete('/by-id/:id', async (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(403).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  try {
    await utils.db.conn.collection('pages').remove(
      { _id: ObjectID(req.params.id) },
    );
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL,
    });
  }

  res.send({ status: 'ok' });
});

/**
 * Create a new custom page.
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
    r = await utils.db.conn.collection('pages').insert({
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL,
    });
  }

  res.send({ status: 'ok', id: r.insertedIds[0] });
});

/**
 * 评论
 */
router.put('/by-slug/:slug/reply', async (req, res) => {
  try {
    await utils.db.conn.collection('pages').update(
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
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  return res.send({
    status: 'ok',
  });
});

module.exports = router;
