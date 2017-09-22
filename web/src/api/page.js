import axios from 'axios';
import config from '../config';

function fetchPages (params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/page?page=${params.page || 1}`)
    .then(response => resolve(response.data.pages))
    .catch(error => reject(error));
  })
}

function fetchPageBySlug (params = {}) {
  if (!params.slug) {
    return Promise.reject('Page slug is required');
  }

  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/page/by-slug/${params.slug}${params.raw ? '/raw' : ''}`)
    .then(response => resolve(response.data.page))
    .catch(error => reject(error));
  });
}

function createPageBySlug (params = {}) {
  if (!params.page) {
    return Promise.reject('Page content is required.');
  } else if (!params.token) {
    return Promise.reject('Access token is required.');
  }

  return new Promise((resolve, reject) => {
    axios.put(`${config.api.url}/page/${params.id}?token=${params.token}`, params.page)
    .then(res => resolve(res.data))
    .catch(err => reject(error));
  });
}

function updatePageBySlug (params = {}) {
  if (!params.id) {
    return Promise.reject('Page id is required.');
  } else if (!params.page) {
    return Promise.reject('Page content is required.');
  } else if (!params.token) {
    return Promise.reject('Access token is required.');
  }

  return new Promise((resolve, reject) => {
    axios.post(`${config.api.url}/page/by-id/${params.id}?token=${params.token}`, params.page)
    .then(res => resolve(res.data))
    .catch(err => reject(error));
  });
}

export default {
  fetchPages, fetchPageBySlug, updatePageBySlug, createPageBySlug
}