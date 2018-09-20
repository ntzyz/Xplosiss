const websocket = require('./websocket');
const db = require('./db');
const uaParser = require('ua-parser-js');

/**
 * Activity logger middleware.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
async function logger (req, res, next) {
  if (req.headers['server-side-rendering'] === 'true') {
    return next();
  }

  let message = `[${new Date().toLocaleString()}] ${req.headers['x-real-ip'] || req.ip} - ${req.method} ${req.url} - ${req.headers['user-agent']}`;

  // Write log to stdout, and push to the log array.
  console.log(message);
  logger.logs.push(message);

  // Keep the log array size not to big
  while (logger.logs.length > 50) {
    logger.logs.shift();
  }

  // Broadcast to all those connected websocket clients.
  websocket.io.emit('log', message);

  // Write log to database
  await db.prepare();
  // We do NOT need to await here.
  if (!/^\/(dist|static|api\/media)/.test(req.url)) {
    db.conn.collection('logs').insert({
      time: new Date(),
      ip: req.headers['x-real-ip'] || req.ip || '0.0.0.0',
      method: req.method,
      url: req.url,
      userAgent: uaParser(req.headers['user-agent']),
    }).catch(error => {
      console.error(error);
    });
  }

  // Continue.
  next();
}

logger.logs = [];

module.exports = logger;
