const randomString = require('./random-string')
const fs = require('fs');

const accessToken = process.env.DEV ? '1' : randomString(15);
const savePath = ` /var/run/user/${process.getuid()}/blog-access-token`

console.log(`Your access token is ${accessToken}`);
fs.writeFile(savePath, accessToken, err => {
  err || console.log(`In case you forget, just restart the server, or find it in ${savePath}`);
});

module.exports = accessToken;