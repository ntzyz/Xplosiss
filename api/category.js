'use strict';

let express = require('express');
let utils = require('../utils');

let router = express.Router();

router.get('/list', (req, res) => {
    utils.getConn().query('select * from category', (err, table) => {
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
        utils.getConn().query({
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