import Gallery from './Gallery.vue';

export function pluginInstaller ({ app, router, store, coreComponents }) {
  console.log('plugin installed!');
  router.addRoutes([
    {
      path: '/gallery',
      components: {
        default: Gallery,
        sidebar: coreComponents.ClientSideBar,
      },
    }
  ]);
  return Promise.resolve();
}

export default pluginInstaller;
