'use strict';

const config = require('../config');
const utils = require('../utils');
let hljs = require('highlight.js');
let pug = require('pug');
let marked = require('marked');

let decodeHTML = (str) => {
    let strMap = {
        '&lt': '<',
        '&gt': '>',
        '&quot': '"',
        '&apos': '\'',
        '&amp': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': '\'',
        '&amp;': '&'
    };
    if (str.length === 0) {
        return '';
    }
    return str.replace(/&[0-9a-zA-Z]+;?/g, function(s) {
        return strMap[s] || s;
    });
}

let render = (posts, isFull) => {
  return posts.map(post => {
    // Render post to HTML.
    if (/^markdown$/i.test(post.content.encoding))
      post.content.content = decodeHTML(marked(table[i][part]));
    else if (/^(jade|pug)$/i.test(post.content.encoding))
      post.content.content = pug.render(post.content.content);

    // Check if need full content
    if (!isFull && post.content.content.indexOf('<!-- more -->') >= 0) {
      post.content.content = post.content.content.substr(0, post.content.content.indexOf('<!-- more -->'));
    }

    // Highlight all block with <code> tag.
    post.content.content = post.content.content.replace(/<code lang="(.+?)">([^]+?)<\/code>/g, (match, p1, p2) => {
      if (!/^markdown$/i.test(post.content.encoding))
        return '<pre>' + hljs.highlight(p1, p2).value + '</pre>';
      else 
        return hljs.highlight(p1, p2).value;
    }).replace(/<code>([^]+?)<\/code>/g, function(match, p1) {
      if (!/^markdown$/i.test(post.content.encoding))
        return '<pre>' + hljs.highlightAuto(p1).value + '</pre>';
      else
        return hljs.highlightAuto(p1).value;
    });

    return post;
  })
}

/**
 * Get posts.
 */
let getHandler = (req, res) => {
  utils.getCollection('posts').then(({db, collection}) => {
    let page = 0;
    let parttern = {};
    let isFull = false;

    if (req.query.page) {
      page = req.query.page - 1;
    }
    if (req.query.full) {
      isFull = true;
    }

    if (req.query.title) {
      parttern.title = req.query.title;
    }

    if (req.query.category) {
      parttern.category = req.query.category;
    }

    if (req.query.tag) {
      parttern.tags = req.query.tag;
    }

    collection.find(parttern).toArray((err, docs) => {
      res.send({
        status: 'ok',
        dataset: render(docs.slice(page * config.pageSize, (page + 1) * config.pageSize), isFull),
        pages: {
          size: config.pageSize,
          current: page,
          count: Math.floor(docs.length / config.pageSize) + docs.length % config.pageSize === 0 ? 0 : 1,
        }
      });
      db.close();
    });

  }).catch(err => console.error(err))
}

module.exports = {
  get: getHandler,
}
