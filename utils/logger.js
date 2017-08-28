const websocket = require('./websocket');

function logger (req, res, next) {
  let message = `[${new Date().toLocaleString()}] ${req.headers['x-real-ip'] || req.ip} - ${req.method} ${req.url} - ${req.headers['user-agent']}`;
  console.log(message);
  logger.logs.push(message);
  while (logger.logs.length > 50) {
    logger.logs.shift();
  }
  websocket.io.emit('log', message);
  next();
}

logger.logs = [];

module.exports = logger;