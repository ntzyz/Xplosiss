'use strict';

let utils = require('../utils');
let fetchCommonData = require('./common');
let render = require('./render');

let handler = (req, res) => {
  fetchCommonData(data => {
    utils.getConn().query({
      sql: [
        'SELECT post_id, category_name, post_date, post_title, post_content, render_type',
        'FROM   post',
        'INNER JOIN category',
        'ON category.category_id = post.post_category_id',
        'WHERE post.post_category_id = ?'
      ].join(' '),
      values: [req.params.cid]
    }, (err, table) => {
      if (err)
        throw err;
      data.posts = table.map(row => {
          row['time'] = (new Date(row['post_date'])).getTime()
          return row;
      });
      data.posts.sort((arg1, arg2) => {
          return arg1['time'] < arg2['time'];
      });
      data.posts = render(data.posts, 'post_content', true);
      res.render('site-views/posts', data);
    });
  })
}

module.exports = handler;