const express = require('express');
const utils = require('../utils');
const config = require('../config');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');

let router = express.Router();

/**
 * 列出所有的媒体文件
 */
router.get('/', (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(400).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  fs.readdir(path.join(__dirname, '../uploads'), (err, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        status: 'error',
        messagee: utils.messages.ERR_FS_FAIL
      });
    }
    let fileWithMimes = [];
    files.filter(file => file[0] !== '.').forEach(file => {
      fileWithMimes.push({
        file,
        mime: mime.lookup(file)
      })
    });
    res.send({
      status: 'ok',
      files: fileWithMimes,
    })
  })
});

/**
 * 访问指定的一个媒体文件
 */
router.get('/:filename', (req, res) => {
  let filePath = path.join(__dirname, '../uploads', req.params.filename);
  if (fs.exists(filePath, exists => {
    if (exists) {
      res.sendFile(filePath)
    } else {
      res.status(404).send({
        status: 'err',
        message: utils.messages.ERR_NOT_FOUND,
      })
    }
  }));
});


module.exports = router;