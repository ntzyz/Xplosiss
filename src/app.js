import regeneratorRuntime from 'regenerator-runtime';
import axios from 'axios';

import App from './App.vue';
import { createRouter, postCreateRouter, coreComponents } from './router';
import { createStore } from './store';
import config from './config.json';

import titleMixin from './utils/title';
import openGraphMixin from './utils/open-graph';

axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status !== 404) {
    console.error(error);
  } else if (error.config) {
    console.log(`ERROR: ${error.errno}: failed to ${error.config.method} ${error.config.url}`);
  }
  return Promise.reject(error);
});

export async function createApp (libs, { quiet } = { quiet: false }) {
  const { Vue, Vuex } = libs;

  Vue.use(Vuex);
  Vue.mixin(titleMixin);
  Vue.mixin(openGraphMixin);
    
  const router = createRouter(null, libs);
  const store = createStore(libs);

  const app = new Vue({
    router, store,
    render: h => h(App)
  });

  await Promise.all(Object.keys(config.plugins).map(async plugin => {
    const pluginManifest = await import(`../plugins/${plugin}/manifest.json`);
    if (!config.plugins[plugin].enabled || !pluginManifest.entry.browser) {
      return;
    }
    const pluginEntity = await import(`../plugins/${plugin}/${pluginManifest.entry.browser}`);
    await pluginEntity.pluginInstaller({ app, router, store, coreComponents, config });
    !quiet && console.log(`Loaded plugin: ${pluginManifest.name} v${pluginManifest.version}, written by ${pluginManifest.author.name}.`);
  }));

  router.addRoutes([{
    path: '/:slug',
    components: {
      default: coreComponents.PageView,
      sidebar: coreComponents.ClientSideBar,
    },
    meta: { keepAlive: false }
  }, {
    path: '*',
    components: {
      default: coreComponents.NotFound,
      sidebar: coreComponents.ClientSideBar,
    },
    meta: { keepAlive: true },
  }]);

  return { app, router, store };
}
