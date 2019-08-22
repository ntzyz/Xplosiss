import * as http from 'http';
import * as socket from 'socket.io';

import token from './token';

let server: http.Server;
let io: socket.Server;

function attachSocketIO (site) {
  if (site) {
    server = new http.Server(site);
    io = socket(server, { path: '/api/ws' });
    io.on('connection', socket => {
      console.log('Client connected!');
      if (socket.handshake.query.token !== token) {
        // Unauthorized connecton, disconnect it.
        console.log([socket.handshake.query.token, token]);
        return socket.disconnect();
      }
    });
  }
  return { io, server };
}

Object.defineProperty(attachSocketIO, 'io', {
  get () {
    return io;
  }
});

Object.defineProperty(attachSocketIO, 'server', {
  get () {
    return server;
  }
});

export default {
  attach: attachSocketIO,
  get io () { return io; },
  get server () { return server; }
};
