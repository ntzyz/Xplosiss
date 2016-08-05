'use strict';

let express = require('express');
let utils = require('../utils');

let router = express.Router();

router.get('/', (req, res) => {
    utils.getConn().query('select * from widget', (err, table) => {
        res.send(JSON.stringify(err ? err : table));
    })
});

module.exports = router;