const pug = require('pug');
const path = require('path');
const fs = require('fs');

function installer ({ site, utils, config }) {
  site.get('/feeds', async (req, res) => {
    try {
      let cursor = utils.db.conn.collection('posts').find({}, { sort: [['date', 'desc']] }).limit(config.page.size);
      posts = await cursor.toArray();
      count = await cursor.count();
    } catch (e) {
      console.error(e);
      return res.status(500).send({
        status: 'error',
        message: utils.messages.ERR_MONGO_FAIL
      });
    }
    fs.readFile(path.resolve(__dirname, './rss2.pug'), 'utf-8', (err, template) => {
      res.set('content-type', 'application/rss+xml');
      res.send(pug.render(template, {
        title: config.title,
        link: config.url,
        feedUrl: config.url + 'feeds',
        language: config.language,
        description: '',
        posts: utils.render(posts, { preview: false }),
        renderedPosts: utils.render(posts, { preview: true }),
        cdata (text, options) {
          return '<![CDATA[' + text.replace(/\]\]>/g, ']]]]><![CDATA[>') + ']]>';
        }
      }));
    });
  });
}

module.exports = installer;
