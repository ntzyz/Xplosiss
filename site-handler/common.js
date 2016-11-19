'use strict';

let utils = require('../utils');

let fetchSiteInfo = (data, callback) => {
  utils.getConn().query('select * from common', (err, table) => {
    if (err) {
      throw err;
    }

    data.siteInfo = {
      title: table[0].blog_title,
      subtitle: table[0].blog_subtitle
    }

    callback(data);
  })
}

let fetchCategorys = (data, callback) => {
  utils.getConn().query('select * from category', (err, table) => {
    if (err) {
      throw err;
    }

    data.categorys = table;

    callback(data);
  })
}

let fetchWidgets = (data, callback) => {
  utils.getConn().query('select * from widget', (err, table) => {
    if (err) {
      throw err;
    }

    data.widgets = table;

    callback(data);
  });
}

let fetchCommonData = (callback) => {
  let data = {};
  fetchSiteInfo(data, data => {
    fetchCategorys(data, data => {
      fetchWidgets(data, data => {
        callback(data);
      })
    })
  })
}

module.exports = fetchCommonData;