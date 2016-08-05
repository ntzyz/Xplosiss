'use strict';

let express = require('express');
let mysql = require('mysql');

let router = express.Router();
let conn = mysql.createConnection(require('../config').MySQL);

router.get('/list', (req, res) => {
    conn.query('select * from category', (err, table) => {
        res.send(JSON.stringify(err ? err : table));
    });
});

router.get('/add', (req, res) => {
    if (!req.query.name) {
        res.send(JSON.stringify({
            status: 'ERROR',
            message: 'Category name not specfied.'
        }));
    }
    else {
        conn.query({
            sql: 'INSERT INTO category(category.category_name) VALUES(?)',
            values: [req.query.name]
        }, (err, table) => {
            res.send(JSON.stringify(err ? err : {
                'status': 'ok'
            }));
        })
    }
});

module.exports = router;