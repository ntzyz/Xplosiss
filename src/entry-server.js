import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import { createApp } from './app.js';
import axios from 'axios';
import regeneratorRuntime from 'regenerator-runtime';

axios.interceptors.request.use(function (config) {
  config.headers = {
    'server-side-rendering': 'true'
  };
  return config;
}, function (error) {
  return Promise.reject(error);
});

export default context => new Promise((resolve, reject) => {
  createApp({
    Vue,
    VueRouter,
    Vuex
  }).then(({ app, store, router }) => {
    router.push(context.url);

    router.onReady(() => {      
      const matchedComponents = router.getMatchedComponents();
  
      if (!matchedComponents.length) {
        return reject({ code: 404, url: '/not-found' });
      }
  
      const componentsWithAsyncData = [];
      const checkComponent = C => {
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
        if (error.response.status === 404) {
          reject({ code: 404, url: '/not-found' });
        }
        reject(error);
      });
    }, reject);
  });
});
