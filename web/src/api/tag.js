import axios from 'axios';
import config from '../config';

function fetchTagsList (params) {
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/tag`)
    .then(response => resolve(response.data.tags))
    .catch(error => reject(error));
  })
}

function fetchPostsByTag (params) {
  if (!params.tag) {
    return Promise.reject('Tag is required.');
  }
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/tag/${params.tag}/posts`)
    .then(response => resolve(response.data.posts))
    .catch(error => reject(error));
  })
}

export default {
  fetchTagsList,
  fetchPostsByTag
}