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

function render(table, part, more) {
    for (let i = 0; i != table.length; ++i) {
        if (table[i].render_type == 1) {
            table[i][part] = pug.render(table[i][part]);
        } else if (table[i].render_type == 2) {
            table[i][part] = decodeHTML(marked(table[i][part]));
        }
        if (more && table[i][part].indexOf('<!-- more -->') >= 0) {
            table[i][part] = table[i][part].substr(0, table[i][part].indexOf('<!-- more -->')) 
        }
        table[i][part] = table[i][part].replace(/<code lang="(.+?)">([^]+?)<\/code>/g, (match, p1, p2) => {
            if (table[i].render_type != 2)
                return '<pre>' + hljs.highlight(p1, p2).value + '</pre>';
            else 
                return hljs.highlight(p1, p2).value;
        }).replace(/<code>([^]+?)<\/code>/g, function(match, p1) {
            if (table[i].render_type != 2)
                return '<pre>' + hljs.highlightAuto(p1).value + '</pre>';
            else
                return hljs.highlightAuto(p1).value;
        });
    }
    return table;
}

router.get('/all', (req, res) => {
    utils.getConn().query('select count(*) as cnt from post inner join category where category.category_id = post.post_category_id', (err, table) => {
        if (err)
            throw err;
        let maxPages = Math.ceil(table[0].cnt / 5);
        utils.getConn().query( {
            sql: 'select post_id, category_name, post_date, post_title, post_content as post_shot, render_type from post inner join category where category.category_id = post.post_category_id order by post_date desc limit ?',
            values: [((req.query.page + 1) * 5)]
        }, (err, table) => {
            if (err) {
                res.send(err);
                return;
            }
            table = render(table, 'post_shot', true);
            res.send(JSON.stringify({
                max_pages: maxPages,
                table: table
            }));
        })
    });
});

router.get('/byPostId', (req, res) => {
    utils.getConn().query({
        sql: 'select post_id, category_name, post_date, post_title, post_content, render_type, post_category_id from post inner join category where category.category_id = post.post_category_id and post_id = ?',
        values: [req.query.post_id]
    }, (err, table) => {
        if (err) {
            res.send(JSON.stringify(err));
            return;
        }
        if (!req.query.raw)
            table = render(table, 'post_content', false);
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
            sql: 'select post_id, category_name, post_date, post_title, post_content as post_shot, render_type from post inner join category where category.category_id = post.post_category_id and post.post_category_id = ? order by post_date desc limit ?',
            values: [req.query.category_id, (req.query.page + 1) * 5]
        }, (err, table) => {
            if (err) {
                res.send(err);
                return;
            }
            table = render(table, 'post_shot', true);
            res.send(JSON.stringify({
                max_pages: maxPages,
                table: table
            }));
        })
    });
});

router.get('/list', (req, res) => {
    utils.getConn().query( {
        sql: 'select post_id, post_date, post_title, post_category_id from post order by post_date desc'
    }, (err, table) => {
        if (err) {
            res.send(err);
            return;
        }
        res.send(JSON.stringify({table}));
    })
});


module.exports = router;