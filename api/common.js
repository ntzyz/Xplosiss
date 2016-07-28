'use strict';

let express = require('express');
let router = express.Router();
let config = require('../config');

router.get('/', (req, res) => {
    res.send(JSON.stringify({
        title: config.blog_title,
        subtitle: config.blog_subtitle
    }));
});

module.exports = router;