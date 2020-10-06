import axios from 'axios';
import Vue from 'vue';
import StatisticsView from './StatisticsView.vue';
import { v4 as uuidv4 } from 'uuid';

export function pluginInstaller ({ app, router, store, coreComponents, config }) {
  router.addRoutes([
    {
      path: '/admin/statistics',
      components: {
        default: StatisticsView,
        sidebar: coreComponents.AdminSideBar
      }
    }
  ]);

  store.commit('addAdminUnit', {
    name: '统计数据',
    href: '/admin/statistics',
  });

  store.registerModule('statistics', {
    state: {
      data: {}
    },
    actions: {
      fetchStatistics: state => {
        return axios.get(`/api/statistics?token=${store.state.token}`).then(response => {
          if (response.data.status === 'ok') {
            delete response.data.status;
            state.commit('setData', response.data);
          }
        });
      },
    },
    mutations: {
      setData: (store, data) => store.data = data,
    }
  });

  if (process.env.VUE_ENV === 'server') {
    return Promise.resolve();
  }

  let browserId = 'nil';
  const reportPageView = () => {
    const payload = {
      referrer: {
        url: document.referrer,
        origin: null,
      },
      browserId,
      path: location.pathname,
    };

    if (payload.path.indexOf('/admin') === 0) {
      return;
    }

    try {
      const url = new URL(document.referrer);
      const origin = payload.referrer.origin = url.origin;

      const searchEngines = {
        ask: /ask\.com/i,
        baidu: /baidu\.com/i,
        bing: /bing\.com/i,
        clearch: /clearch\.org/i,
        duckduckgo: /(duckduckgo\.com)|(ddg\.gg)/i,
        google: /google\./i,
        yahoo: /yahoo\.com/i,
        yandex: /yandex\.ru/i,
        qwant: /qwant\.com/i
      };
  
      for (engine of Object.keys(searchEngines)) {
        if (searchEngines[engine].test(origin)) {
          payload.referrer.searchEngine = engine;
        }
      }
    } catch (ex) {
      // doing nothing...
    }

    axios.put('/api/pageview', payload).catch(_ => {});
  };

  if (config.plugins.statistics.enableBrowserIdentifier) {
    browserId = localStorage.getItem('browser-id');

    if (!browserId) {
      browserId = uuidv4();
      localStorage.setItem('browser-id', browserId);
    }
  }

  if (config.plugins.statistics.respectDNT && navigator.doNotTrack) {
    browserId = 'nil';
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
