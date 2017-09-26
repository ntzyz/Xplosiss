const express = require('express');
const utils = require('../utils');
const { ObjectID } = require('mongodb');
const config = require('../config');

let router = express.Router();

/**
 * 获取所有的静态页
 */
router.get('/', async (req, res) => {
  let pages, count;
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
  })
});

/**
 * 按照 slug 获得指定静态页
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
    })
  }

  return res.send({
    status: 'ok',
    page: utils.render([page], { preview: false })[0],
  })
});

/**
 * 按照 ID 获得指定静态页（未渲染，用于编辑）
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
    })
  }

  return res.send({
    status: 'ok',
    page,
  })
});

/**
 * 按照 ID 更新
 */
router.post('/by-id/:id', async (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(400).send({
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
 * 按照 ID 删除
 */
router.delete('/by-id/:id', async (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(400).send({
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
 * 创建
 */
router.put('/', async (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(400).send({
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

  res.send({ status: 'ok', _id: r.insertedIds[0] });
});

module.exports = router;
