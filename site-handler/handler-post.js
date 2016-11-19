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
        'WHERE post_id = ?'
      ].join(' '),
      values: [req.params.pid]
    }, (err, table) => {
      if (err)
        throw err;
      data.post = render(table, 'post_content', false)[0];
      res.render('site-views/post', data);
    });
  })
}

module.exports = handler;