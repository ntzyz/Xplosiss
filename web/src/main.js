import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex'

import App from './App.vue';
import ClientSideBar from './components/ClientSideBar.vue';
import PostsList from './views/PostsList.vue';
import PostView from './views/PostView.vue';

import AdminSideBar from './components/admin/AdminSideBar.vue';
import TokenSetter from './components/admin/TokenSetter.vue';
import AdminPostsList from './components/admin/PostsList.vue';
import AdminPostEditor from './components/admin/PostEditor.vue';

import store from './store';

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      components: {
        default: PostsList,
        sidebar: ClientSideBar,
      },
      meta: { keepAlive: true }
    }, {
      path: '/page/:page',
      components: {
        default: PostsList,
        sidebar: ClientSideBar,
      },
      meta: { keepAlive: true }
    }, {
      path: '/tag/:tag',
      components: {
        default: PostsList,
        sidebar: ClientSideBar,
      },
      meta: { keepAlive: true }
    }, {
      path: '/tag/:tag/page/:page',
      components: {
        default: PostsList,
        sidebar: ClientSideBar,
      },
      meta: { keepAlive: true }
    }, {
      path: '/category/:category',
      components: {
        default: PostsList,
        sidebar: ClientSideBar,
      },
      meta: { keepAlive: true }
    }, {
      path: '/category/:category/page/:page',
      components: {
        default: PostsList,
        sidebar: ClientSideBar,
      },
      meta: { keepAlive: true }
    }, {
      path: '/post/:slug',
      components: {
        default: PostView,
        sidebar: ClientSideBar,
      },
      meta: { keepAlive: false }
    }, {
      path: '/admin',
      components: {
        default: TokenSetter,
        sidebar: AdminSideBar
      },
      meta: { keepAlive: true }
    }, {
      path: '/admin/post',
      components: {
        default: AdminPostsList,
        sidebar: AdminSideBar
      },
      meta: { keepAlive: true },
    }, {
      path: '/admin/post/page/:page',
      components: {
        default: AdminPostsList,
        sidebar: AdminSideBar
      },
      meta: { keepAlive: true },
    }, {
      path: '/admin/post/edit/:id',
      components: {
        default: AdminPostEditor,
        sidebar: AdminSideBar
      },
      meta: { keepAlive: true },
    }, {
      path: '/admin/post/new',
      components: {
        default: AdminPostEditor,
        sidebar: AdminSideBar
      },
      meta: { keepAlive: true, empty: true },
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  if (store.state.forceReload) {
    window.location.href = to.fullPath;
  } else {
    next();
  }
})

Vue.mixin({
  beforeMount () {
    const { asyncData } = this.$options;
    if (asyncData) {
      this.dataPromise = asyncData({
        store: this.$store,
        route: this.$route
      });
    }
  }
});

new Vue({
  el: '#app',
  router, store,
  render: h => h(App)
})
