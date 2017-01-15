'use strict';

const fs = require('fs');

let common = {};

(function() {
  fs.readFile('common.json', 'UTF-8', (err, text) => {
    if (err) {
      console.log('common.json not found, using default one.')
      common = {
        blogTitle: 'namespace ntzyz;',
        blogSubtitle: '(╯‵□′)╯︵┻━┻',
      };
    }
    else {
      common = JSON.parse(text);
    }
    process.on('SIGINT', () => {
      if (common) {
        process.stdout.write('\rSaving latest common config ... ');
        fs.writeFile('common.json', JSON.stringify(common), () => {
          console.log('done.');
          process.exit(0);
        });
      }
    });
  });
})();

/**
 * Get common info.
 */
let getHandler = (req, res) => {
  res.send({
    status: 'ok',
    common,
  });
}

/**
 * Update common info.
 */
let putHandler = (req, res) => {
  req.query.blogTitle && (common.blogTitle = req.query.blogTitle);
  req.query.blogSubtitle && (common.blogTitle = req.query.blogSubtitle);
  res.send({
    status: 'ok',
  });
}

module.exports = {
  get: getHandler,
  put: putHandler,
}