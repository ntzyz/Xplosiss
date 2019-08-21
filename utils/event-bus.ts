import * as EventEmitter from 'events';

class BlogEventEmitter extends EventEmitter {};

const eventBus = new BlogEventEmitter();

Object.defineProperties(eventBus, {
  'EVENT_TOKEN_FORGOT': {
    value: 'EVENT_TOKEN_FORGOT',
    writable: false,
    configurable: false,
    enumerable: false,
  },
  'EVENT_NEW_REPLY': {
    value: 'EVENT_NEW_REPLY',
    writable: false,
    configurable: false,
    enumerable: false,
  },
});

export default eventBus;
