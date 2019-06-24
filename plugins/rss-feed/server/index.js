const pug = require('pug');
const path = require('path');
const fs = require('fs');
const express = require('express');

const RSS_CACHE_STATUS_HEADER = 'X-RSS-From-Cache';

function installer ({ site, utils, config }) {
  function renderXML (posts, acceptLanguage) {
    let resolve, promise;
    promise = new Promise(r => resolve = r);

    fs.readFile(path.resolve(__dirname, './rss2.pug'), 'utf-8', (err, template) => {
      const xml = pug.render(template, {
        title: config.title,
        link: config.url + '/',
        feedUrl: config.url + '/feeds',
        language: config.language,
        description: '',
        posts: utils.render(posts, { preview: false, acceptLanguage }),
        renderedPosts: utils.render(posts, { preview: true, acceptLanguage }),
        pubDate: (posts.length === 0 ? new Date(0) : posts[0].date).toUTCString(),
        cdata (text, options) {
          return '<![CDATA[' + text.replace(/\]\]>/g, ']]]]><![CDATA[>') + ']]>';
        }
      });

      resolve(xml);
    });

    return promise;
  }

  const router = express.Router();
  let rssLastModifiedDate = new Date();

  router.use((req, res, next) => {
    res.set('content-type', 'application/rss+xml');
    res.header(RSS_CACHE_STATUS_HEADER, 'false');
    
    next();
  });

  router.use((req, res, next) => {
    utils.db.prepare().then(next);
  });

  router.get('/', async (req, res) => {
    const acceptLanguage = req.query.acceptLanguage || '';

    try {
      let cursor = utils.db.conn.collection('posts').find({
        hideOnIndex: {
          $ne: true,
        }
      }, { sort: [['date', 'desc']] }).limit(config.page.size);
      posts = await cursor.toArray();
    } catch (e) {
      console.error(e);
      return res.status(500).send({
        status: 'error',
        message: utils.messages.ERR_MONGO_FAIL
      });
    }

    rssCacheContent = await renderXML(posts, acceptLanguage);

    res.append('Last-Modified', rssLastModifiedDate.toUTCString());
    res.send(rssCacheContent);
  });

  router.get('/category/:category', async (req, res) => {
    const acceptLanguage = req.query.acceptLanguage || '';

    try {
      let cursor = utils.db.conn.collection('posts').find({
        category: req.params.category
      }, { sort: [['date', 'desc']] }).limit(config.page.size);
      posts = await cursor.toArray();
    } catch (e) {
      console.error(e);
      return res.status(500).send({
        status: 'error',
        message: utils.messages.ERR_MONGO_FAIL
      });
    }

    rssCacheContent = await renderXML(posts, acceptLanguage);

    res.append('Last-Modified', rssLastModifiedDate.toUTCString());
    res.send(rssCacheContent);
  });

  site.use((req, res, next) => {
    switch (req.method) {
    case 'PUT':
    case 'POST':
    case 'DELETE':
      rssLastModifiedDate = new Date();
    default:
      next();
    }
  });
  site.use('/feeds', router);
  site.use('/', (req, res, next) => {
    res.links = [{
      rel: 'alternate',
      type: 'application/rss+xml',
      title: `RSS Feed for ${config.url}/`,
      href: '/feeds'
    }];

    next();
  });
  site.use('/category/:category', (req, res, next) => {
    res.links = [{ 
      rel: 'alternate',
      type: 'application/rss+xml',
      title: `RSS Feed for ${config.url}/category/${req.params.category}`,
      href: `/feeds/category/${encodeURIComponent(req.params.category)}`
    }];

    next();
  });
}

module.exports = installer;
