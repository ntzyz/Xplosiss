import * as express from 'express';
import utils from '../utils';

let router = express.Router();

/**
 * Get lastest 50 records of logs.
 */
router.get('/', async (req, res) => {
  if (req.query.token !== utils.token) {
    return res.status(403).send({
      status: 'error',
      message: utils.messages.ERR_ACCESS_DENIED,
    });
  }

  return res.send({
    status: 'ok',
    logs: utils.logger.logs
  });
});

export default router;
