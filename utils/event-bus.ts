import { EventEmitter } from 'events';

class BlogEventEmitter extends EventEmitter {
  public EVENT_TOKEN_FORGOT = 'EVENT_TOKEN_FORGOT';
  public EVENT_NEW_REPLY = 'EVENT_NEW_REPLY';
};

const eventBus = new BlogEventEmitter();

export default eventBus;
