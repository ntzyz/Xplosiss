import * as pug from 'pug';
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import { PluginOptions } from '../../../types/plugin';
import { BlogPost } from '../../../types/models';

const RSS_CACHE_STATUS_HEADER = 'X-RSS-From-Cache';

function installer ({ site, utils, config }: PluginOptions) {
  function renderXML (posts: BlogPost[], acceptLanguage: string) {
    let resolve: (ret: string) => void;
    let promise: Promise<string>;

    promise = new Promise((r: (ret: string) => void) => resolve = r);

    fs.readFile(path.resolve(__dirname, './rss2.pug'), 'utf-8', (err, template) => {
      const xml = pug.render(template, {
        title: config.title,
        link: config.url + '/',
        feedUrl: config.url + '/feeds',
        language: config.language,
        description: '',
        posts: utils.render(posts, { preview: false, acceptLanguage }),
        renderedPosts: utils.render(posts, { preview: true, acceptLanguage }),
        pubDate: (posts.length === 0 ? new Date(0) : new Date(posts[0].date)).toUTCString(),
        cdata (text: string) {
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
    const acceptLanguage = (req.query.acceptLanguage as string) || '';
    let posts;
  
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

    const rssCacheContent = await renderXML(posts, acceptLanguage);

    res.append('Last-Modified', rssLastModifiedDate.toUTCString());
    res.send(rssCacheContent);
  });

  router.get('/category/:category', async (req, res) => {
    const acceptLanguage = (req.query.acceptLanguage as string) || '';
    let posts;

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

    const rssCacheContent = await renderXML(posts, acceptLanguage);

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
    res.headLinks = [{
      rel: 'alternate',
      type: 'application/rss+xml',
      title: `RSS Feed for ${config.url}/`,
      href: '/feeds'
    }];

    next();
  });
  site.use('/category/:category', (req, res, next) => {
    res.headLinks = [{ 
      rel: 'alternate',
      type: 'application/rss+xml',
      title: `RSS Feed for ${config.url}/category/${req.params.category}`,
      href: `/feeds/category/${encodeURIComponent(req.params.category)}`
    }];

    next();
  });
}

export default installer;
