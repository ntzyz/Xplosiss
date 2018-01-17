import axios from 'axios';
import config from '../config.json';

function fetchTagsList (params) {
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/tag`)
      .then(response => resolve(response.data.tags))
      .catch(error => reject(error));
  });
}

function fetchPostsByTag (params) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.tag) {
      return Promise.reject('Tag is required.');
    }
  }
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/tag/${encodeURIComponent(params.tag)}/posts?page=${params.page || 1}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

export default {
  fetchTagsList,
  fetchPostsByTag
};
