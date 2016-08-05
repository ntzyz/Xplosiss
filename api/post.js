'use strict';

let express = require('express');
let hljs = require('highlight.js');
let pug = require('pug');
let marked = require('marked');
let utils = require('../utils');

let router = express.Router();

function decodeHTML(str) {
    var strMap = {
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

router.get('/all', (req, res) => {
    utils.getConn().query('select count(*) as cnt from post inner join category where category.category_id = post.post_category_id', (err, table) => {
        if (err)
            throw err;
        let maxPages = Math.ceil(table[0].cnt / 5);
        utils.getConn().query( {
            sql: 'select post_id, category_name, post_date, post_title, post_shot from post inner join category where category.category_id = post.post_category_id order by post_date desc limit ?',
            values: [((req.query.page + 1) * 5)]
        }, (err, table) => {
            res.send(JSON.stringify(err ? err : {
                max_pages: maxPages,
                table: table
            }));
        })
    });
});

router.get('/byPostId', (req, res) => {
    utils.getConn().query({
        sql: 'select post_id, category_name, post_date, post_title, post_content, render_type from post inner join category where category.category_id = post.post_category_id and post_id = ?',
        values: [req.query.post_id]
    }, (err, table) => {
        if (err) {
            res.send(JSON.stringify(err));
        }
        if (table[0].render_type == 1) {
            table[0].post_content = pug.render(table[0].post_content);
        } else if (table[0].render_type == 2) {
            table[0].post_content = decodeHTML(marked(table[0].post_content));
        }
        table[0].post_content = table[0].post_content.replace(/<code lang="(.+?)">([^]+?)<\/code>/g, (match, p1, p2) => {
            if (table[0].render_type != 2)
                return '<pre>' + hljs.highlight(p1, p2).value + '</pre>';
            else 
                return hljs.highlight(p1, p2).value;
        }).replace(/<code>([^]+?)<\/code>/g, function(match, p1) {
            if (table[0].render_type != 2)
                return '<pre>' + hljs.highlightAuto(p1).value + '</pre>';
            else
                return hljs.highlightAuto(p1).value;
        });
        res.send(table);
    })
});

router.get('/byCategoryId', (req, res) => {
    utils.getConn().query({
        sql: 'select count(*) as cnt from post inner join category where category.category_id = post.post_category_id and post.post_category_id = ?',
        values: [req.query.category_id]
    }, (err, table) => {
        let maxPages = Math.ceil(table[0].cnt / 5);
        utils.getConn().query({
            sql: 'select post_id, category_name, post_date, post_title, post_shot from post inner join category where category.category_id = post.post_category_id and post.post_category_id = ? order by post_date desc limit ?',
            values: [req.query.category_id, (req.query.page + 1) * 5]
        }, (err, table) => {
            res.send(JSON.stringify(err ? err : {
                max_pages: maxPages,
                table: table
            }));
        })
    });
});

module.exports = router;