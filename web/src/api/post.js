import axios from 'axios';
import config from '../config';

function fetchPosts (params) {
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/post`)
    .then(response => resolve(response.data.posts))
    .catch(error => reject(error));
  })
}

function fetchPostBySlug (params) {
  if (!params.slug) {
    return Promise.reject('Post slug is required.');
  }
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/post/${params.slug}`)
    .then(response => resolve(response.data.post))
    .catch(error => reject(error));
  })
}

export default {
  fetchPosts,
  fetchPostBySlug
}