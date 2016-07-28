'use strict';

let express = require('express');
let mysql = require('mysql');

let router = express.Router();
let conn = mysql.createConnection(require('../config').MySQL);

router.get('/all', (req, res) => {
    conn.query('select post_id, category_name, post_date, post_title, post_shot from post inner join category where category.category_id = post.post_category_id order by post_date desc', (err, table) => {
        res.send(JSON.stringify(err ? err : table));
    })
});

router.get('/byPostId', (req, res) => {
    conn.query({
        sql: 'select post_id, category_name, post_date, post_title, post_content from post inner join category where category.category_id = post.post_category_id and post_id = ?',
        values: [req.query.post_id]
    }, (err, table) => {
        res.send(JSON.stringify(err ? err : table));
    })
});

/*router.get('/byCategoryId', (req, res) => {
    conn.query('select * from post', (err, table) => {
        res.send(JSON.stringify(err ? err : table));
    })
});*/

module.exports = router;