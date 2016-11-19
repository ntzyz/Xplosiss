'use strict';

let express = require('express');
let app = express();
let config = require('./config');

app.set('view engine', 'pug');
app.set('views', './');

app.use('/static', express.static('./www'));

app.get('/', require('./site-handler/handler-index.js'));
app.get('/category/:cid', require('./site-handler/handler-category.js'));
app.get('/post/:pid', require('./site-handler/handler-post.js'));

app.use('/management', require('./management.js'));

app.listen(config.bind_port);

console.log('Listening on http://[::]:' + require('./config').bind_port);
