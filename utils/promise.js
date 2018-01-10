'use strict';

process.on('unhandledRejection', (error, p) => {
  /* istanbul ignore next */
  console.log('Unhandled Rejection at: Promise', p, 'reason:', error);
  /* istanbul ignore next */
  process.exit(1);
});