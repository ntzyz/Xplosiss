import Vue from 'vue';
import Vuex from 'vuex';
import actions from './store/actions';
import mutations from './store/mutations';

Vue.use(Vuex);

export function createStore () {
  const store = new Vuex.Store({
    state: {
      categories: [],
      tags: [],
      posts: [],
      widgets: [],
      replies: null,
      pages: {},
      post: null,
      busy: true,
      forceReload: false,
      page: {},
      token: '',
    },
    actions,
    mutations
  });
  return store;
};
