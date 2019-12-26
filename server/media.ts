import * as express from 'express';
import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';
import * as multer from 'multer';

import utils from '../utils';
import { BlogMedia } from '../types/models';

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
    return res.status(403).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  fs.readdir(path.join(__dirname, '../uploads'), (err, files) => {
    if (err) {
      /* istanbul ignore next */
      return res.status(500).send({
        status: 'error',
        messagee: utils.messages.ERR_FS_FAIL
      });
    }
    let fileWithMimes: BlogMedia[] = [];
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

interface MulterFile {
  key: string;
  path: string;
  mimetype: string;
  originalname: string;
  size: number;
}

interface ExpressRequestWithFile {
  file: MulterFile;
}

/**
 * Upload one new file.
 */
router.put('/:filename', upload.single('file'), (req: express.Request & ExpressRequestWithFile, res) => {
  if (req.query.token !== utils.token) {
    fs.unlink(req.file.path, () => {});
    return res.status(403).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  const newFileName = `${new Date().getTime()}-${req.params.filename}`;

  fs.rename(req.file.path, path.join(__dirname, `../uploads/${new Date().getTime()}-${req.params.filename}`), err => {
    if (err) {
      /* istanbul ignore next */
      res.status(500).send({
        status: 'error',
        message: err
      });
    } else {
      res.send({
        status: 'ok',
        filename: newFileName,
      });
    }
  });
});

/**
 * Delete one file.
 */
router.delete('/:filename', (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(403).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  fs.unlink(path.join(__dirname, '../uploads', req.params.filename), err => {
    if (err) {
      /* istanbul ignore next */
      console.error(err);
      /* istanbul ignore next */
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

export default router;
