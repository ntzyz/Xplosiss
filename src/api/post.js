import axios from 'axios';
import config from '../config.json';

function fetchPosts (params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/post?page=${params.page || 1}${ params.full ? '&full=true' : ''}${ params.titleOnly ? '&title-only=true' : '' }${ params.pagesize ? `&pagesize=${params.pagesize}` : ''}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

function fetchPostBySlug (params) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.slug) {
      return Promise.reject('Post slug is required.');
    }
  }

  const options = {};
  if (params.preferLanguage) {
    options.headers = {
      'accept-language': params.preferLanguage,
    };
  }

  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/post/by-slug/${encodeURIComponent(params.slug)}${params.password ? `?password=${encodeURIComponent(params.password)}` : ''}`, options)
      .then(response => resolve(response.data.post))
      .catch(error => reject(error));
  });
}

function fetchPostById (params) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.id) {
      return Promise.reject('Post id is required.');
    }
  }
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/post/by-id/${params.id}/raw`)
      .then(response => resolve(response.data.post))
      .catch(error => reject(error));
  });
}

function updatePostById (params) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.id) {
      return Promise.reject('Post id is required.');
    } else if (!params.post) {
      return Promise.reject('Post body is required.');
    } else if (!params.token) {
      return Promise.reject('Access token is required.');
    }
  }
  return new Promise((resolve, reject) => {
    axios.post(`${config.api.url}/post/by-id/${params.id}?token=${params.token}`, params.post)
      .then(response => resolve(response.data.post))
      .catch(error => reject(error));
  });
}

function deletePostById (params) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.id) {
      return Promise.reject('Post id is required.');
    } else if (!params.token) {
      return Promise.reject('Access token is required.');
    }
  }
  return new Promise((resolve, reject) => {
    axios.delete(`${config.api.url}/post/by-id/${params.id}?token=${params.token}`)
      .then(response => resolve(response.data.post))
      .catch(error => reject(error));
  });
}

function createPost (params) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.post) {
      return Promise.reject('Post body is required.');
    } else if (!params.token) {
      return Promise.reject('Access token is required.');
    }
  }
  return new Promise((resolve, reject) => {
    axios.put(`${config.api.url}/post?token=${params.token}`, params.post)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

function putReplyBySlug (params) {
  return new Promise((resolve, reject) => {
    axios.put(`${config.api.url}/post/by-slug/${encodeURIComponent(params.slug)}/reply`, params.data)
      .then(response => resolve(response.dat))
      .catch(error => reject(error));
  });
}

export default {
  fetchPosts,
  fetchPostBySlug,
  fetchPostById,
  updatePostById,
  deletePostById,
  createPost,
  putReplyBySlug
};
