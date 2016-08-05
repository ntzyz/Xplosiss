'use strict';

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

let utils = {
    getConn: function() {
        return conn;
    }
}

module.exports = utils;
