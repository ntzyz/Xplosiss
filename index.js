let express = require('express');
let app = express();

app.use('/api/category', require('./api/category'));
app.use('/api/common', require('./api/common'));
app.use('/api/widget', require('./api/widget'));
app.use('/api/post', require('./api/post'));

app.use('/', express.static('www'));
app.use('/post/*', express.static('www'));

app.listen(require('./config').bind_port);
console.log('Listening on http://[::]:' + require('./config').bind_port);