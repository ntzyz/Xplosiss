import { ObjectID, Collection } from 'mongodb';
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

  site.get('/api/statistics', async (req, res) => {
    if (req.query.token !== utils.token) {
      return res.status(403).send({
        status: 'error',
        message: utils.messages.ERR_ACCESS_DENIED,
      });
    }

    const statistics = db.conn.collection('statistics');

    // 摘要
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    
    /// PV UV
    const PVUV: {[key: string]: { pageview: number, uniqueview: number }} = {};
    [
      PVUV.today,
      PVUV.yesterday,
      PVUV.last7Days,
      PVUV.last30Days,
      PVUV.last365Days,
    ] = await Promise.all([
      fetchPVUV(today, now, statistics),
      fetchPVUV(new Date(today.getTime() - 1000 * 60 * 60 * 24), today, statistics),
      fetchPVUV(new Date(today.getTime() - 7 * 1000 * 60 * 60 * 24), now, statistics),
      fetchPVUV(new Date(today.getTime() - 30 * 1000 * 60 * 60 * 24), now, statistics),
      fetchPVUV(new Date(today.getTime() - 365 * 1000 * 60 * 60 * 24), now, statistics),
    ]);

    /// 搜索引擎
    const searchEngineRank = await statistics.aggregate([
      { $match: { 'referrer.searchEngine': { $ne: null } } },
      { $group: { _id: '$referrer.searchEngine', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]).toArray();

    /// 浏览器
    const browser = await statistics.aggregate([
      { $group: { _id: '$userAgent.browser.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]).toArray();

    /// 页面排名
    const pathRank = await statistics.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]).toArray();

    /// 国家/地区
    const countryRank = await statistics.aggregate([
      { $group: { _id: '$ip.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { country: '$_id', count: 1, _id: 0 } },
    ]).toArray();

    /// 引用
    const referrerRank = await statistics.aggregate([
      { $group: { _id: '$referrer.origin', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { origin: '$_id', count: 1, _id: 0 } },
    ]).toArray();

    res.send({
      status: 'ok',
      PVUV,
      searchEngineRank,
      browser,
      pathRank,
      countryRank,
      referrerRank,
    });
  });
}

async function fetchPVUV (begin: Date, end: Date, statistics: Collection<any>) {
  let result = {
    pageview: 0,
    uniqueview: 0,
  };

  result.pageview = await statistics.find({
    $and: [
      { time: { $lt: end } },
      { time: { $gt: begin } },
    ]
  }).count();

  result.uniqueview = (await statistics.distinct('browserId', {
    $and: [
      { time: { $lt: end } },
      { time: { $gt: begin } },
    ]
  })).length;

  return result;
}


export default pluginInstaller;
