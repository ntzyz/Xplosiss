const fs = require('fs');
const path = require('path');
const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer');

const resolve = file => path.resolve(file);
const isProd = process.env.NODE_ENV === 'production';

const app = express();

function createRenderer (bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    basedir: resolve('./dist'),
    runInNewContext: false,
  }));
}

let renderer, readyPromise;
const templatePath = resolve('./src/index.html');

if (isProd) {
  const template = fs.readFileSync(templatePath, 'utf-8')
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
} else {
  readyPromise = require('./build/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options);
    }
  )
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

app.get('/favicon.ico', (req, res) => res.status(404).send(''));
app.get('/robots.txt', (req, res) => res.status(404).send(''));
app.use('/dist', serve('./dist', true));
app.use('/public', serve('./public', true))
app.use('/manifest.json', serve('./manifest.json', true))
app.use('/service-worker.js', serve('./dist/service-worker.js'))

// Read config from config.js
let config = fs.readFileSync('./src/config.js', 'UTF-8');
let tmp = config.split(' ');
tmp.shift(), tmp.shift();
config = JSON.parse(tmp.join(' '));

function render (req, res) {
  res.setHeader('Content-Type', 'text/html');

  const errorHandler = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if (err.code === 404) {
      res.status(404).send('Page not found.');
    } else {
      res.status(500).send('Internal server error.');
      console.log(err);
      // console.log(err.stack);
    }
  }

  const context = {
    url: req.url,
    title: config.title
  };

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return errorHandler(err);
    }
    res.send(html);
  });
}

app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res));
})

const port = process.env.PORT || 8008;
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})