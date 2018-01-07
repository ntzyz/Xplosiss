import Gallery from './Gallery.vue';
import GalleryAdmin from './GalleryAdmin.vue';
import axios from 'axios';

export function pluginInstaller ({ app, router, store, coreComponents, config }) {
  router.addRoutes([
    {
      path: '/gallery',
      components: {
        default: Gallery,
        sidebar: coreComponents.ClientSideBar,
      },
    }, {
      path: '/admin/gallery',
      components: {
        default: GalleryAdmin,
        sidebar: coreComponents.AdminSideBar
      }
    }
  ]);

  store.registerModule('gallery', {
    state: {
      images: {},
    },
    actions: {
      fetchImages: state => {
        return axios.get(`${config.api.url}/gallery`).then(response => {
          state.commit('setImages', response.data.images);
        });
      },
      createImage: (state, image) => {
        image.tags = image.tags.split(' ');
        return axios.put(`${config.api.url}/gallery?token=${store.state.token}`, image);
      },
      removeImage: (state, id) => {
        return axios.delete(`${config.api.url}/gallery/${id}?token=${store.state.token}`);
      },
      updateImage: (state, image) => {
        return axios.post(`${config.api.url}/gallery/${image._id}?token=${store.state.token}`, image);
      }
    },
    mutations: {
      setImages: (store, images) => store.images = images,
    }
  });

  store.commit('addAdminUnit', {
    name: '管理 Gallery',
    href: '/admin/gallery',
  });

  return Promise.resolve();
}

export default pluginInstaller;
