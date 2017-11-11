import Vue from 'vue';
import Vuex from 'vuex';
import regeneratorRuntime from 'regenerator-runtime';

import App from './App.vue';
import { createRouter, postCreateRouter, coreComponents } from './router';
import { createStore } from './store';
import config from './config.json';

import titleMixin from './utils/title';

Vue.use(Vuex);
Vue.mixin(titleMixin);

export async function createApp () {
  const router = createRouter();
  const store = createStore();

  const app = new Vue({
    router, store,
    render: h => h(App)
  });

  await Promise.all(config.plugins.map(async plugin => {
    const pluginMeta = await import(`../plugins/${plugin}/meta.json`);
    const pluginEntity = await import(`../plugins/${plugin}/${pluginMeta.entry.client}`);
    await pluginEntity.pluginInstaller({ app, router, store, coreComponents });
  }));

  return { app, router, store };
}
