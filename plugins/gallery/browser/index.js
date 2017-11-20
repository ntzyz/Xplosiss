import Gallery from './Gallery.vue';
import axios from 'axios';

export function pluginInstaller ({ app, router, store, coreComponents, config }) {
  router.addRoutes([
    {
      path: '/gallery',
      components: {
        default: Gallery,
        sidebar: coreComponents.ClientSideBar,
      },
    }
  ]);

  store.registerModule('gallery', {
    state: {
      images: {},
    },
    actions: {
      fetchImages: state => {
        return axios.get(`${config.api.url}/gallery`).then(response => {
          console.log(response.data.images);
          state.commit('setImages', response.data.images);
        });
      }
    },
    mutations: {
      setImages: (store, images) => store.images = images,
    }
  });

  return Promise.resolve();
}

export default pluginInstaller;
