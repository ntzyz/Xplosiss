'use strict';

let express = require('express');
let router = express.Router();
let config = require('../config');
let utils = require('../utils');

router.get('/', (req, res) => {
    utils.getConn().query('select * from common', (err, table) => {
        if (err) {
            res.send(JSON.stringify(err));
        }
        let row = table[0];
        res.send(JSON.stringify({
            title: row.blog_title,
            subtitle: row.blog_subtitle
        }));
    })
});

module.exports = router;