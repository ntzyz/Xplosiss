const express = require('express');
const utils = require('../utils');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '../uploads') });

let router = express.Router();

// Serve all static files through express's serve-static
// for security
router.use('/', express.static('uploads'));
router.use('/', express.static('statics'));

/**
 * List all media files.
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
      });
    });
    res.send({
      status: 'ok',
      files: fileWithMimes,
    });
  });
});

/**
 * Upload one new file.
 */
router.put('/:filename', upload.single('file'), (req, res) => {
  if (req.query.token !== utils.token) {
    fs.unlink(req.file.path, () => {});
    return res.status(400).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
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
  });
});

/**
 * Delete one file.
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
      });
    } else {
      res.send({
        status: 'ok',
      });
    }
  });
});

module.exports = router;
