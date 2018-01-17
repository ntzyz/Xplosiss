const websocket = require('./websocket');

/**
 * Activity logger middleware.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
function logger (req, res, next) {
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

  // Continue.
  next();
}

logger.logs = [];

module.exports = logger;
