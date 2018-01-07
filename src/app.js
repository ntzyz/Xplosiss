import Vue from 'vue';
import Vuex from 'vuex';
import regeneratorRuntime from 'regenerator-runtime';

import App from './App.vue';
import { createRouter, postCreateRouter, coreComponents } from './router';
import { createStore } from './store';
import config from './config.json';

import titleMixin from './utils/title';
import openGraphMixin from './utils/open-graph';

Vue.use(Vuex);
Vue.mixin(titleMixin);
Vue.mixin(openGraphMixin);
// Vue.mixin({
//   beforeMount () {
//     const { asyncData } = this.$options;
//     if (asyncData) {
//       this.dataPromise = new Promise((resolve, reject) => {
//         this.$nextTick(() => {
//           asyncData({
//             store: this.$store,
//             route: this.$route
//           }).then(resolve).catch(reject);
//         });
//       });
//     }
//   }
// });

export async function createApp () {
  const router = createRouter();
  const store = createStore();

  const app = new Vue({
    router, store,
    render: h => h(App)
  });

  await Promise.all(config.plugins.map(async plugin => {
    const pluginManifest = await import(`../plugins/${plugin}/manifest.json`);
    if (!pluginManifest.entry.browser) {
      return;
    }
    const pluginEntity = await import(`../plugins/${plugin}/${pluginManifest.entry.browser}`);
    await pluginEntity.pluginInstaller({ app, router, store, coreComponents, config });
    console.log(`Loaded plugin: ${pluginManifest.name} v${pluginManifest.version}, written by ${pluginManifest.author.name}.`);
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
