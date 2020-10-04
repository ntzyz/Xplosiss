import http from 'http';
import socket from 'socket.io';
import express from 'express';

import token from './token';

let server: http.Server;
let io: socket.Server;

function attachSocketIO (site: express.Application) {
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
