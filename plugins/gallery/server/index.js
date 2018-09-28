const { ObjectID } = require('mongodb');

function pluginInstaller ({ site, utils }) {
  site.get('/api/gallery', async (req, res) => {
    let images;

    try {
      images = await utils.db.conn.collection('gallery').find({}, { sort: [['date', 'desc']] }).toArray();
    } catch (e) {
      return res.status(500).send({
        status: 'error',
        message: utils.messages.ERR_MONGO_FAIL
      });
    }

    return res.send({
      status: 'ok',
      images,
    });
  });

  site.put('/api/gallery', async (req, res) => {
    if (req.query.token !== utils.token) {
      return res.status(403).send({
        status: 'error',
        message: utils.messages.ERR_ACCESS_DENIED,
      });
    }

    let r;
    try {
      r = await utils.db.conn.collection('gallery').insertOne({
        title: req.body.title,
        description: req.body.description,
        cover: req.body.cover,
        tags: req.body.tags,
        href: req.body.href,
        date: req.body.date,
      });
    } catch (e) {
      return res.status(500).send({
        status: 'error',
        message: utils.messages.ERR_MONGO_FAIL
      });
    }

    res.send({ status: 'ok', id: r.insertedIds[0] });
  });

  site.delete('/api/gallery/:id', async (req, res) => {
    if (req.query.token !== utils.token) {
      return res.status(403).send({
        status: 'error',
        message: utils.messages.ERR_ACCESS_DENIED,
      });
    }
  
    try {
      await utils.db.conn.collection('gallery').remove(
        { _id: ObjectID(req.params.id) }
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

  site.post('/api/gallery/:id', async (req, res) => {
    if (req.query.token !== utils.token) {
      return res.status(403).send({
        status: 'error',
        message: utils.messages.ERR_ACCESS_DENIED,
      });
    }
  
    try {
      await utils.db.conn.collection('gallery').findAndModify(
        { _id: ObjectID(req.params.id) },
        [],
        { $set: {
          title: req.body.title,
          description: req.body.description,
          cover: req.body.cover,
          tags: req.body.tags,
          href: req.body.href,
          date: req.body.date,
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
}

module.exports = pluginInstaller;
