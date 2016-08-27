'use strict';

// Database utils

let mysql = require('mysql');

let conn = mysql.createConnection(require('./config').MySQL);

let disconnectHandler = function() {
    conn.on('error', (err) => {
        if (!err.fatal) {
            return;
        }
        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }
        conn.destroy();
        conn = mysql.createConnection(require('./config').MySQL);
        disconnectHandler();
    });
}
disconnectHandler();

// Encrypt/decrypt utils
// from http://lollyrock.com/articles/nodejs-encryption/

let crypto = require('crypto');
let algorithm = require('./config').auth.algorithm;
let password = require('./config').auth.password;

function encrypt(content){
    let cipher = crypto.createCipher(algorithm, password)
    let crypted = cipher.update(content, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}
 
function decrypt(content){
    let decipher = crypto.createDecipher(algorithm, password)
    let dec = decipher.update(content, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

let utils = {
    getConn: function() {
        return conn;
    },
    encrypt: encrypt,
    decrypt: decrypt
}

module.exports = utils;
