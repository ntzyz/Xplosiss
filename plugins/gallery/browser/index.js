import Gallery from './Gallery.vue';
import GalleryAdmin from './GalleryAdmin.vue';
import axios from 'axios';

export function pluginInstaller ({ app, router, store, coreComponents, config }) {
  router.addRoutes([
    {
      path: config.plugins.gallery.mountPoint || '/gallery',
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
      title: config.plugins.gallery.title || 'Gallery',
      images: {},
    },
    actions: {
      fetchImages: state => {
        return axios.get('/api/gallery').then(response => {
          state.commit('setImages', response.data.images);
        });
      },
      createImage: (state, image) => {
        return axios.put(`/api/gallery?token=${store.state.token}`, image);
      },
      removeImage: (state, id) => {
        return axios.delete(`/api/gallery/${id}?token=${store.state.token}`);
      },
      updateImage: (state, image) => {
        return axios.post(`/api/gallery/${image._id}?token=${store.state.token}`, image);
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
