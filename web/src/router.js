import Vue from 'vue';
import VueRouter from 'vue-router';

import ClientSideBar from './components/ClientSideBar.vue';
import PostsList from './views/PostsList.vue';
import PostView from './views/PostView.vue';
import PageView from './views/PageView.vue';
import NotFound from './views/NotFound.vue';

import AdminSideBar from './components/admin/AdminSideBar.vue';
import TokenSetter from './components/admin/TokenSetter.vue';
import AdminPostsList from './components/admin/PostsList.vue';
import AdminPostEditor from './components/admin/PostEditor.vue';
import AdminWidgets from './components/admin/Widgets.vue';
import AdminLogs from './components/admin/AccessLogs.vue';
import AdminMedia from './components/admin/Media.vue';
import AdminPage from './components/admin/Page.vue';

Vue.use(VueRouter);

export function createRouter () {
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
        meta: { keepAlive: false }
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
      }, {
        path: '/admin/widgets',
        components: {
          default: AdminWidgets,
          sidebar: AdminSideBar
        },
        meta: { keepAlive: true },
      }, {
        path: '/admin/media',
        components: {
          default: AdminMedia,
          sidebar: AdminSideBar
        },
        meta: { keepAlive: true },
      }, {
        path: '/admin/page',
        components: {
          default: AdminPage,
          sidebar: AdminSideBar
        },
        meta: { keepAlive: true },
      }, {
        path: '/admin/logs',
        components: {
          default: AdminLogs,
          sidebar: AdminSideBar
        },
        meta: { keepAlive: true },
      }, {
        path: '/not-found',
        components: {
          default: NotFound,
          sidebar: ClientSideBar,
        },
        meta: { keepAlive: true },
      }, {
        path: '/:slug',
        components: {
          default: PageView,
          sidebar: ClientSideBar,
        },
        meta: { keepAlive: false }
      }, {
        path: '*',
        components: {
          default: NotFound,
          sidebar: ClientSideBar,
        },
        meta: { keepAlive: true },
      }
    ],
    scrollBehavior (to, from, savedPosition) {
      return savedPosition || { x: 0, y: 0 };
    }
  });

  return router;
}