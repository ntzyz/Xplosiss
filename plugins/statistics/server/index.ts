import { ObjectID } from 'mongodb';
import * as geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

import { PluginOptions } from '../../../types/plugin';

function pluginInstaller ({ site, utils }: PluginOptions) {
  const { db } = utils;

  site.put('/api/pageview', (req, res) => {
    const ipAddr = req.headers['x-real-ip'] || req.ip || '0.0.0.0';
    const userAgent = new UAParser(req.headers['user-agent']);

    db.conn.collection('statistics').insertOne({
      time: new Date(),
      ip: Object.assign({
        addr: ipAddr,
      }, geoip.lookup(Array.isArray(ipAddr) ? ipAddr[0] : ipAddr) || {}),
      path: req.body.path,
      referrer: req.body.referrer,
      browserId: req.body.browserId,
      userAgent: userAgent.getResult(),
    }).catch(error => {
      console.error(error);
    });

    res.send({status: 'ok'});
  });
}

export default pluginInstaller;
