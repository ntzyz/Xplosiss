'use strict';

let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let utils = require('./utils');

let router = express.Router();
router.use(cookieParser());
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

// use static value temporarily
let userInfo = {
    ntzyz: 'my_great_password_that_you_will_never_see_lol'
};

// let's check if remote side authorized.
router.use((req, res, next) => {
    if (req.url == '/login') {
        // we shouldn't redirect login page any more.
        next();
        return;
    }
    if (req.cookies.authorizedkey == null) {
        // seems to be the first time, go and login yourself.
        res.redirect(301, './login');
        return;
    }

    // decrypt the key and check if it is valid.
    try {
        let authInfo = JSON.parse(utils.decrypt(req.cookies.authorizedkey));
        if (userInfo[authInfo.uname] && userInfo[authInfo.uname] != authInfo.passwd) {
            // invalid key, reject
            throw 'login info is invalid.';
        }
    } catch (err) {
        // something wrong, so we have to delete the key and send him to the login page
        res.clearCookie('authorizedkey');
        res.redirect(301, './login');
        return;
    }

    // All done, go to next step
    next();
});

router.get('/login', (req, res) => {
    // render the login page.
    res.render('login', {note: ''});
});

router.post('/login', (req, res) => {
    console.log([req.body, userInfo[req.body.uname]]);
    // check the login info
    if (userInfo[req.body.uname] != req.body.passwd) {
        // incorrect, send a message to browser.
        res.render('login', {note: 'Wrong username or password.'});
        return;
    }
    // Passwd, insert authorized key into cookies.
    res.cookie('authorizedkey', utils.encrypt(JSON.stringify(req.body)));
    res.redirect(301, './index');
});

router.get('/index', (req, res) => {
    res.send('Great Success.');
});

module.exports = router;
