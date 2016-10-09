'use strict';

let express = require('express');
let utils = require('../utils');

let router = express.Router();

router.get('/list', (req, res) => {
    utils.getConn().query('select * from category', (err, table) => {
        res.send(JSON.stringify(err ? err : table));
    });
});

module.exports = router;