'use strict';

let express = require('express');
let mysql = require('mysql');

let router = express.Router();
let conn = mysql.createConnection(require('../config').MySQL);

router.get('/all', (req, res) => {
    conn.query('select count(*) as cnt from post inner join category where category.category_id = post.post_category_id', (err, table) => {
        let maxPages = Math.ceil(table[0].cnt / 5);
        conn.query( {
            sql: 'select post_id, category_name, post_date, post_title, post_shot from post inner join category where category.category_id = post.post_category_id order by post_date desc limit 5 OFFSET ?',
            values: [(req.query.page * 5)]
        }, (err, table) => {
            res.send(JSON.stringify(err ? err : {
                max_pages: maxPages,
                table: table
            }));
        })
    });
});

router.get('/byPostId', (req, res) => {
    conn.query({
        sql: 'select post_id, category_name, post_date, post_title, post_content from post inner join category where category.category_id = post.post_category_id and post_id = ?',
        values: [req.query.post_id]
    }, (err, table) => {
        res.send(JSON.stringify(err ? err : table));
    })
});

router.get('/byCategoryId', (req, res) => {
    conn.query({
        sql: 'select count(*) as cnt from post inner join category where category.category_id = post.post_category_id and post.post_category_id = ?',
        values: [req.query.category_id]
    }, (err, table) => {
        let maxPages = Math.ceil(table[0].cnt / 5);
        conn.query({
            sql: 'select post_id, category_name, post_date, post_title, post_shot from post inner join category where category.category_id = post.post_category_id and post.post_category_id = ? order by post_date desc limit 5 offset ?',
            values: [req.query.category_id, (req.query.page * 5)]
        }, (err, table) => {
            res.send(JSON.stringify(err ? err : {
                max_pages: maxPages,
                table: table
            }));
        })
    });
});

module.exports = router;