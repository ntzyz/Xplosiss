import axios from 'axios';
import config from '../config';

function fetchCategoryList (params) {
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/category`)
    .then(response => resolve(response.data.categories))
    .catch(error => reject(error));
  })
}

function fetchPostsByCategory (params) {
  if (!params.category) {
    return Promise.reject('Category is required.');
  }
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/category/${params.category}/posts`)
    .then(response => resolve(response.data.posts))
    .catch(error => reject(error));
  })
}

export default {
  fetchCategoryList,
  fetchPostsByCategory
}
