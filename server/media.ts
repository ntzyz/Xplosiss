import express from 'express';
import fs from 'fs';
import mime from 'mime-types';
import path from 'path';
import multer from 'multer';
import child_process from 'child_process';
import { promisify } from 'util';

import utils from '../utils';

const rename = promisify(fs.rename);
const unlink = promisify(fs.unlink);

const upload = multer({ dest: path.join(__dirname, '../uploads') });

let router = express.Router();
let imageMagicAvailable = false;
let imageMagicWebpAvailable = false;
let imageMagicJpegAvailable = false;

// Serve all static files through express's serve-static
// for security
router.use('/', express.static('uploads'));
router.use('/', express.static('statics'));

function checkImageMagickFeatures () {
  child_process.exec('convert -version', (error, stdout, stderr) => {
    if (stderr) {
      console.log('"convert" command not found in path. Install "ImageMagick" or image convert feature won\'t be available.');
      return;
    } else {
      imageMagicAvailable = true;
      imageMagicWebpAvailable = /webp/.test(stdout);
      imageMagicJpegAvailable = /jpeg/.test(stdout);
    }
  });
}

function convertFileToJPEG (fileName: string): Promise<string> {
  const origFile = path.join(__dirname, `../uploads/${fileName}`);
  const newFile = origFile + '.converted.jpg';
  return new Promise((resolve, reject) => {
    child_process.exec(`convert "${origFile}" -quality 85 "${newFile}"`, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      resolve(fileName  + '.converted.jpg');
    });
  });
}

function convertFileToWebP (fileName: string): Promise<string> {
  const origFile = path.join(__dirname, `../uploads/${fileName}`);
  const newFile = origFile + '.converted.webp';
  return new Promise((resolve, reject) => {
    child_process.exec(`convert "${origFile}" -quality 85 "${newFile}"`, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      resolve(fileName  + '.converted.webp');
    });
  });
}

checkImageMagickFeatures();

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
};

interface ExpressRequestWithFile {
  file: MulterFile
};

/**
 * Upload one new file.
 */
router.put('/:filename', upload.single('file'), async (req: express.Request & ExpressRequestWithFile, res) => {
  if (req.query.token !== utils.token) {
    fs.unlink(req.file.path, () => {});
    return res.status(403).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  const newFileName = `${new Date().getTime()}-${req.params.filename}`;
  const fileFullPath = path.join(__dirname, `../uploads/${new Date().getTime()}-${req.params.filename}`);
  const alternative: { jpeg: string, webp: string } = { jpeg: null, webp: null };
  try {
    await rename(req.file.path, fileFullPath);
  } catch (err) {
    /* istanbul ignore next */
    res.status(500).send({
      status: 'error',
      message: err
    });
    return;
  }

  if (imageMagicAvailable && req.query.convert === 'true') {
    try {
      const [jpeg, webp] = await Promise.all([
        convertFileToJPEG(newFileName),
        convertFileToWebP(newFileName),
      ]);

      alternative.jpeg = jpeg;
      alternative.webp = webp;
    } catch (err) {
      console.error(err);
    }
  }

  res.send({
    status: 'ok',
    filename: newFileName,
    alternative,
  });
});

/**
 * Delete one file.
 */
router.delete('/:filename', async (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(403).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  try {
    await unlink(path.join(__dirname, '../uploads', req.params.filename));
  } catch (err) {
    if (err.code != 'ENOENT') {
      /* istanbul ignore next */
      console.error(err);
      /* istanbul ignore next */
      res.status(500).send({
        status: 'error',
        message: err,
      });
    }
    return;
  }

  res.send({
    status: 'ok',
  });
});

export default router;
