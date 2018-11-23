import ClientSideBar from './components/ClientSideBar.vue';
import PostsListView from './views/PostsListView.vue';
import PostView from './views/PostView.vue';
import PageView from './views/PageView.vue';
import NotFound from './views/NotFound.vue';

const AdminSideBar = () => import(/* webpackChunkName: "group-admin" */ './components/admin/AdminSideBar.vue');
const TokenSetter = () => import(/* webpackChunkName: "group-admin" */ './components/admin/TokenSetter.vue');
const AdminPostsList = () => import(/* webpackChunkName: "group-admin" */ './components/admin/PostsList.vue');
const AdminPostEditor = () => import(/* webpackChunkName: "group-admin" */ './components/admin/PostEditor.vue');
const AdminWidgets = () => import(/* webpackChunkName: "group-admin" */ './components/admin/Widgets.vue');
const AdminLogs = () => import(/* webpackChunkName: "group-admin" */ './components/admin/AccessLogs.vue');
const AdminMedia = () => import(/* webpackChunkName: "group-admin" */ './components/admin/Media.vue');
const AdminPage = () => import(/* webpackChunkName: "group-admin" */ './components/admin/Page.vue');

export let coreComponents = { ClientSideBar, PostsListView, PostView, PageView, NotFound, AdminSideBar };

export function createRouter (extraRoutes, { Vue, VueRouter }) {
  Vue.use(VueRouter);

  const router = new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/',
        components: {
          default: PostsListView,
          sidebar: ClientSideBar,
        },
        meta: { keepAlive: true }
      }, {
        path: '/page/:page',
        components: {
          default: PostsListView,
          sidebar: ClientSideBar,
        },
        meta: { keepAlive: true }
      }, {
        path: '/tag/:tag',
        components: {
          default: PostsListView,
          sidebar: ClientSideBar,
        },
        meta: { keepAlive: true }
      }, {
        path: '/tag/:tag/page/:page',
        components: {
          default: PostsListView,
          sidebar: ClientSideBar,
        },
        meta: { keepAlive: true }
      }, {
        path: '/category/:category',
        components: {
          default: PostsListView,
          sidebar: ClientSideBar,
        },
        meta: { keepAlive: true }
      }, {
        path: '/category/:category/page/:page',
        components: {
          default: PostsListView,
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
      }
    ],
    scrollBehavior (to, from, savedPosition) {
      if (!savedPosition) {
        return { x: 0, y: 0 };
      }
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(savedPosition);
        }, 300);
      });
    }
  });

  return router;
};

export function postCreateRouter (router) {
  router.addRoutes([{
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
  }]);
};

