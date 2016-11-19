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
let userInfo = {};

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
    res.render('management-views/login', {note: ''});
});

router.post('/login', (req, res) => {
    utils.getConn().query('select * from user', (err, table) => {
        if (err) throw err;
        // save all query result to userInfo;
        userInfo = {};
        table.forEach((item) => {
            userInfo[item.user_name] = item.user_pass;
        });
        let loginInfo = {
            uname: req.body.uname,
            passwd: utils.md5(req.body.passwd)
        }
        // check the login info
        if (userInfo[loginInfo.uname] != loginInfo.passwd) {
            // incorrect, send a message to browser.
            res.render('management-views/login', {note: 'Wrong username or password.'});
            return;
        }
        // Passwd, insert authorized key into cookies.
        res.cookie('authorizedkey', utils.encrypt(JSON.stringify(loginInfo)));
        res.redirect(301, './index');
    });
});

router.get('/index', (req, res) => {
    // index of contorl panel.
    res.render('management-views/index');
});

router.get('/post', (req, res) => {
    // manage all the posts on this page.
    res.render('management-views/post');
})
/*
var content = {
    post_id: this.selected,
    post_title: $('#title').val(),
    post_content: editor.getSession().getValue(),
    post_date: $('#datepicker').val(),
    post_category_id: $('#category_picker').val(),
    render_type: $('#render_picker').val()
}*/
router.post('/post', (req, res) => {
    let content = JSON.parse(req.body.content);
    if (req.body.operation == 'delete') {
        utils.getConn().query({
            sql: 'delete from post where post_id = ?',
            values: [content.post_id]
        }, (err, table) => {
            if (err) {
                res.send(err);
            }
            else {
                res.render('management-views/post');
            }
        })
    }
    else if (content.post_id == -1) {
        utils.getConn().query({
            sql: 'INSERT INTO post(post_title, post_content, post_date, post_category_id, render_type) VALUES(?, ?, ?, ?, ?)',
            values: [content.post_title, content.post_content, content.post_date, content.post_category_id, content.render_type]
        }, (err, table) => {
            if (err) {
                res.send(err);
            }
            else {
                res.render('management-views/post');
            }
        })
    }
    else {
        utils.getConn().query({
            sql: 'UPDATE post SET post_title = ?, post_content = ?, post_date = ?, post_category_id = ?, render_type = ? WHERE post_id = ?',
            values: [content.post_title, content.post_content, content.post_date, content.post_category_id, content.render_type, content.post_id]
        }, (err, table) => {
            if (err) {
                res.send(err);
            }
            else {
                res.render('management-views/post');
            }
        })
    }
})

router.get('/widget', (req, res) => {
    // manage all the widgets in this page.
    res.render('/management-viewswidget');
});

module.exports = router;
