const EventEmitter = require('events');

class BlogEventEmitter extends EventEmitter {};

Object.defineProperties(BlogEventEmitter, {
  'EVENT_TOKEN_FORGOT': {
    value: Symbol('EVENT_TOKEN_FORGOT'),
    writable: false,
    configurable: false,
    enumerable: false,
  },
  'EVENT_NEW_REPLY': {
    value: Symbol('EVENT_NEW_REPLY'),
    writable: false,
    configurable: false,
    enumerable: false,
  },
});

const eventBus = new BlogEventEmitter();

module.exports = eventBus;
