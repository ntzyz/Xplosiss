const http = require('http');
const socket = require('socket.io');
const token = require('./token');

let server;
let io;

function attachSocketIO (site) {
  if (site) {
    server = http.Server(site);
    io = socket(server, { path: '/api/ws' }); 
    io.on('connection', socket => {
      if (socket.handshake.query.token !== token) {
        // Unauthorized connecton, disconnect it.
        console.log([socket.handshake.query.token, token])
        return socket.disconnect();
      }
    });
  }
  return { io, server, };
}

Object.defineProperty(attachSocketIO, 'io', {
  get: function () {
    return io;
  }
});

Object.defineProperty(attachSocketIO, 'server', {
  get: function () {
    return server;
  }
});

module.exports = {
  attach: attachSocketIO,
  get io () { return io; },
  get server () { return server; }
};
