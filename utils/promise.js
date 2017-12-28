'use strict';

process.on('unhandledRejection', (error, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', error);
  process.exit(1);
});