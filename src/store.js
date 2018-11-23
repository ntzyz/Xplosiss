import actions from './store/actions';
import mutations from './store/mutations';

export function createStore ({ Vue, Vuex }) {
  Vue.use(Vuex);

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
      extraAdminUnits: [],
    },
    actions,
    mutations
  });
  return store;
};
