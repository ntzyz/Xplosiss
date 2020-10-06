import axios from 'axios';

function fetchTagsList (params) {
  return new Promise((resolve, reject) => {
    axios.get('/api/tag')
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
    axios.get(`/api/tag/${encodeURIComponent(params.tag)}/posts?page=${params.page || 1}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

export default {
  fetchTagsList,
  fetchPostsByTag
};
