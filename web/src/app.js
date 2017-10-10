import Vue from 'vue';
import Vuex from 'vuex'

import App from './App.vue';
import { createRouter } from './router';
import { createStore } from './store';

import titleMixin from './utils/title';

Vue.use(Vuex);
Vue.mixin(titleMixin);

export function createApp () {
  const router = createRouter();
  const store = createStore();
  const app = new Vue({
    router, store,
    render: h => h(App)
  });
  return { app, router, store };
}
