const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const utils = require('./utils');
const fs = require('fs');
const path = require('path');
const { createBundleRenderer } = require('vue-server-renderer');

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const serve = (p, cache) => express.static(path.resolve(__dirname, p), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
});

let site = express();
let pluginRouter = express.Router();

// disable 'x-powered-by' for security
site.disable('x-powered-by');

// parse sitelication/x-www-form-urlencoded
site.use(bodyParser.urlencoded({ extended: true }));

// parse sitelication/json
site.use(bodyParser.json());

// print all access logs
site.use(utils.logger);

// set CORS headers
site.use((req, res, next) => {
  const origin = req.headers.origin;

  if (config.allowedOrigins.indexOf(origin) >= 0) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    
    // PUT must be allowed or nobody can post a reply when CROS.
    res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  return next();
});

// Router for all plugins
site.use(pluginRouter);

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
const templatePath = path.resolve(__dirname, isProd ? 'src/index.prod.html' : 'src/index.dev.html');

// Setup server renderer
if (isProd || isTest) {
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
site.use('/dist', serve('./dist', true));
site.use('/public', serve('./public', true));
site.use('/manifest.json', serve('./manifest.json', true));
site.use('/service-worker.js', serve('./dist/service-worker.js'));
site.use(serve('./static'));

// Read client config from ./src/config.js
let clientConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'src/config.json'), 'UTF-8'));

// The actual render entry.
function render (req, res) {
  res.setHeader('Content-Type', 'text/html');

  const errorHandler = err => {
    if (err.url) {
      res.redirect(err.url);
    } else {
      res.status(500).send('500');
      console.log(err);
    }
  };

  const context = {
    url: req.url,
    title: clientConfig.title,
    meta: {
      ...clientConfig.meta,
      links: res.links || [],
    },
    acceptLanguage: req.headers['accept-language'],
  };

  if (req.path === '/not-found') {
    res.status(404);
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return errorHandler(err);
    }
    res.send(html);
  });
}

// Install all plugins
Object.keys(config.plugins).forEach(plugin => {
  let manifest;

  try {
    manifest = JSON.parse(fs.readFileSync(path.join(__dirname, './plugins/', plugin, './manifest.json')));
  } catch(e) {
    console.error(e);
  }

  if (!config.plugins[plugin].enabled || !manifest.entry.server) {
    return;
  }

  const installer = require(path.join(__dirname, './plugins/', plugin, manifest.entry.server));
  installer({ site: pluginRouter, utils, config });
  console.log(`Loaded plugin: ${manifest.name} v${manifest.version}, written by ${manifest.author.name}.`);
});

// deal with all those unhandled requests here.
site.get('*', (isProd || isTest) ?
  (req, res) => {
    utils.db.prepare().then(() => render(req, res));
  } :
  (req, res) => {
    Promise.all([readyPromise, utils.db.prepare()]).then(() => render(req, res));
  }
);

// Establish database connection and start http service
utils.websocket.server.listen(config.port, /* 'localhost', */() => {
  console.log(`Server started on port ${config.port}`);
});

module.exports = site;