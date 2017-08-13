import axios from 'axios';
import config from '../config';

function fetchPosts (params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/post?page=${params.page || 1}`)
    .then(response => resolve(response.data))
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