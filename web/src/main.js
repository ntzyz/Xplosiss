import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex'

import App from './App.vue';
import PostsList from './views/PostsList.vue';
import PostView from './views/PostView.vue';

import store from './store';

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: PostsList,
      meta: { keepAlive: true }
    }, {
      path: '/page/:page',
      component: PostsList,
      meta: { keepAlive: true }
    }, {
      path: '/tag/:tag',
      component: PostsList,
      meta: { keepAlive: true }
    }, {
      path: '/tag/:tag/page/:page',
      component: PostsList,
      meta: { keepAlive: true }
    }, {
      path: '/category/:category',
      component: PostsList,
      meta: { keepAlive: true }
    }, {
      path: '/category/:category/page/:page',
      component: PostsList,
      meta: { keepAlive: true }
    }, {
      path: '/post/:slug',
      component: PostView,
      meta: { keepAlive: false }
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
