const http = require('http');
const socket = require('socket.io');

let server;
let io;

function attachSocketIO (site) {
  if (site) {
    server = http.Server(site);
    io = socket(server, { path: '/api/ws' }); 
    io.on('connection', socket => {
      console.log('Client connected!');
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
