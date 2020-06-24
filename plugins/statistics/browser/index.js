import axios from 'axios';
import Vue from 'vue';
import { v4 as uuidv4 } from 'uuid';

export function pluginInstaller ({ app, router, store, coreComponents, config }) {
  if (process.env.VUE_ENV === 'server') {
    return Promise.resolve();
  }

  let browserId = 'nil';
  const reportPageView = () => {
    const payload = {
      referrer: document.referrer,
      browserId,
      path: location.pathname,
    };

    axios.put('/api/pageview', payload).catch(_ => {});
  }

  if (config.plugins.statistics.enableBrowserIdentifier) {
    browserId = localStorage.getItem('browser-id');

    if (!browserId) {
      browserId = uuidv4();
      localStorage.setItem('browser-id', browserId);
    }
  }

  if (config.plugins.statistics.respectDNT && navigator.doNotTrack) {
    browserId = 'nil'
  }

  app.$on('initialized', () => {
    reportPageView();
    router.afterEach((to, _from) => {
      reportPageView();
    });
  });


  return Promise.resolve();
}

export default pluginInstaller;
