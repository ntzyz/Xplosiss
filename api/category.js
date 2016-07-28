'use strict';

let express = require('express');
let mysql = require('mysql');

let router = express.Router();
let conn = mysql.createConnection(require('../config').MySQL);

router.get('/list', (req, res) => {
    conn.query('select * from category', (err, table) => {
        res.send(JSON.stringify(err ? err : table));
    })
});

module.exports = router;