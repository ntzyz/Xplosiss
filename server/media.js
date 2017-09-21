const express = require('express');
const utils = require('../utils');
const config = require('../config');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const multer  = require('multer')
const upload = multer({ dest: path.join(__dirname, '../uploads') });

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
      res.setHeader('content-type', mime.lookup(filePath) || 'text/plain');
      res.sendFile(filePath);
    } else {
      res.status(404).send({
        status: 'err',
        message: utils.messages.ERR_NOT_FOUND,
      })
    }
  }));
});

/**
 * 上传一个文件
 */
router.put('/:filename', upload.single('file'), (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(400).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
    fs.unlink(req.file.path, () => {});
  }

  fs.rename(req.file.path, path.join(__dirname, `../uploads/${new Date().getTime()}-${req.params.filename}`), err => {
    if (err) {
      res.status(500).send({
        status: 'err',
        message: err
      });
    } else {
      res.send({
        status: 'ok',
      });
    }
  })
});

/**
 * 删除一个文件
 */
router.delete('/:filename', (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(400).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  fs.unlink(path.join(__dirname, '../uploads', req.params.filename), err => {
    if (err) {
      res.status(500).send({
        status: 'error',
        message: err,
      })
    } else {
      res.send({
        status: 'ok',
      });
    }
  });
});

module.exports = router;