const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const utils = require('./utils');
const fs = require('fs');
const path = require('path');
const { createBundleRenderer } = require('vue-server-renderer');

const isProd = process.env.NODE_ENV === 'production';
const serve = (p, cache) => express.static(path.resolve(__dirname, p), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
});

let site = express();

if (!isProd) {
  console.log('[WARN] You are now in development mode, HTTP header Access-Control-Allow-Origin will be set to *.');
  site.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
}

// disable 'x-powered-by' for security
site.disable('x-powered-by');

// parse sitelication/x-www-form-urlencoded
site.use(bodyParser.urlencoded({ extended: true }));

// parse sitelication/json
site.use(bodyParser.json());

// print all access logs
site.use(utils.logger);

// API entry
site.use('/api', require('./server'));

// favicon
site.get('/favicon.ico', (req, res) => {
  if (config.favicon) {
    res.sendFile(config.favicon, { root: __dirname });
  } else {
    res.status(404).send('');
  }
});

// Attach Socket.IO handlers
utils.websocket.attach(site);

// Factory for Vue renderer
function createRenderer (bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    basedir: path.resolve(__dirname, './dist'),
    runInNewContext: false,
  }));
}

// Renderer and HTML template
let renderer, readyPromise;
const templatePath = path.resolve(__dirname, 'src/index.html');

// Setup server renderer
if (isProd) {
  // Create renderer once, and keeping using it until SIGTERM
  const template = fs.readFileSync(templatePath, 'utf-8');
  const bundle = require('./dist/vue-ssr-server-bundle.json');
  const clientManifest = require('./dist/vue-ssr-client-manifest.json');
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  });
} else {
  // Use webpack-dev-middleware, recreate renderer in case source is changed.
  readyPromise = require('./build/setup-dev-server')(
    site,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options);
    }
  );
}

// Setup some static files
site.get('/favicon.ico', (req, res) => res.status(404).send(''));
site.get('/robots.txt', (req, res) => res.status(404).send(''));
site.use('/dist', serve('./dist', true));
site.use('/public', serve('./public', true));
site.use('/manifest.json', serve('./manifest.json', true));
site.use('/service-worker.js', serve('./dist/service-worker.js'));

// Read client config from ./src/config.js
let clientConfig = fs.readFileSync(path.resolve(__dirname, 'src/config.js'), 'UTF-8');
let tmp = clientConfig.split(' ');
// Remove the first two words(export, default)
tmp.shift(); tmp.shift();
// Parse the remaining part with eval.
try {
  eval('clientConfig = ' + tmp.join(' ')); // eslint-disable-line
} catch (e) {
  console.error(e);
}

// The actual render entry.
function render (req, res) {
  console.log('here');
  res.setHeader('Content-Type', 'text/html');

  const errorHandler = err => {
    if (err.url) {
      res.redirect(err.url);
    } else if (err.code === 404) {
      res.status(404).send('Page not found.');
    } else {
      res.redirect('/not-found');
      console.log(err.stack);
    }
  };

  const context = {
    url: req.url,
    title: clientConfig.title,
    meta: clientConfig.meta,
  };

  context.meta.keywords = '';

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return errorHandler(err);
    }
    res.send(html);
  });
}

// deal with all those unhandled requests here.
site.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res));
});

// Establish database connection and start http service
utils.db.prepare().then(() => {
  utils.websocket.server.listen(config.port, /* 'localhost', */() => {
    console.log(`Server started on port ${config.port}`);
  });
});
