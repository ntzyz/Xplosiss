import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import { createApp } from './app.js';
import axios from 'axios';
import config from './config.json';

function axiosMiddleware (config) {
  config.headers['server-side-rendering'] = true;

  axiosMiddleware.configLang(config);

  return config;
}

axios.interceptors.request.use(axiosMiddleware, function (error) {
  return Promise.reject(error);
});

export default context => new Promise((resolve, reject) => {
  axiosMiddleware.configLang = function (cfg) {
    if (context.acceptLanguage && !cfg.headers['accept-language']) {
      cfg.headers['accept-language'] = context.acceptLanguage;
    }
  };

  // Setup baseURL for axios
  axios.defaults.baseURL = `http://127.0.0.1:${config.port}/`;
  axios.defaults.port = config.port;

  createApp({
    Vue,
    VueRouter,
    Vuex
  }, {
    quiet: true
  }).then(({ app, store, router }) => {
    router.push(context.url);

    router.onReady(() => {      
      const matchedComponents = router.getMatchedComponents();
  
      if (!matchedComponents.length) {
        return reject({ code: 404, url: '/not-found' });
      }
  
      const componentsWithAsyncData = [];
      const checkedCompoments = [];
      const checkComponent = C => {
        if (checkedCompoments.indexOf(C) >= 0) {
          return;
        }
        checkedCompoments.push(C);
        if (C.asyncData) {
          componentsWithAsyncData.push(C);
        }
        if (C.components) {
          Object.keys(C.components).forEach(name => {
            checkComponent(C.components[name]);
          });
        }
      };
  
      matchedComponents.forEach(C => {
        checkComponent(C);
      });
  
      Promise.all(componentsWithAsyncData.map(Component => {
        return Component.asyncData({
          store,
          route: router.currentRoute
        });
      })).then(() => {
        context.state = store.state;
        resolve(app);
      }).catch(error => {
        if (error.response && error.response.status === 404) {
          reject({ code: 404, url: '/not-found' });
          return;
        }
        console.error(error);
        reject(error);
      });
    }, reject);
  });
});
