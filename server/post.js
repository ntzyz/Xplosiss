const express = require('express');
const utils = require('../utils');
const { ObjectID } = require('mongodb');

let router = express.Router();

router.get('/', async (req, res) => {
  let posts;
  try {
    posts = await utils.db.conn.collection('posts').find({}, { sort: [['date', 'desc']]}).toArray();
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  for (post of posts) {
    delete post.replies;
  }

  return res.send({
    status: 'ok',
    posts: utils.render(posts, { preview: true }),
  })
});

router.get('/:slug', async (req, res) => {
  let post;
  try {
    post = await utils.db.conn.collection('posts').findOne({ slug: req.params.slug });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  if (!post) {
    return res.status(404).send({
      status: 'error',
      message: utils.messages.ERR_NOT_FOUND,
    })
  }

  post.replies.forEach(reply => delete reply.email )

  return res.send({
    status: 'ok',
    post: utils.render([post], { preview: false })[0],
  })
});

router.put('/:slug/reply', async (req, res) => {
  let post;
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
    )
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  return res.send({
    status: 'ok',
  })
});


router.get('/:id/raw', async (req, res) => {
  let post;
  try {
    post = await utils.db.conn.collection('posts').findOne({ _id: ObjectID(req.params.id) });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: utils.messages.ERR_MONGO_FAIL
    });
  }

  if (!post) {
    return res.status(404).send({
      status: 'error',
      message: utils.messages.ERR_NOT_FOUND,
    })
  }

  return res.send({
    status: 'ok',
    post,
  })
});

router.post('/:id', async (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(400).send({
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

router.put('/', async (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(400).send({
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


module.exports = router;