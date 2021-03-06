import axios from 'axios';

function fetchPages (params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(`/api/page?page=${params.page || 1}`)
      .then(response => resolve(response.data.pages))
      .catch(error => reject(error));
  });
}

function fetchPageBySlug (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.slug) {
      return Promise.reject('Page slug is required');
    }
  }

  return new Promise((resolve, reject) => {
    axios.get(`/api/page/by-slug/${encodeURIComponent(params.slug)}${params.raw ? '/raw' : ''}`)
      .then(response => resolve(response.data.page))
      .catch(error => reject(error));
  });
}

function fetchPageById (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.id) {
      return Promise.reject('Page id is required');
    }
  }

  return new Promise((resolve, reject) => {
    axios.get(`/api/page/by-id/${params.id}${params.raw ? '/raw' : ''}`)
      .then(response => resolve(response.data.page))
      .catch(error => reject(error));
  });
}

function createPage (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.page) {
      return Promise.reject('Page content is required.');
    } else if (!params.token) {
      return Promise.reject('Access token is required.');
    }
  }

  return new Promise((resolve, reject) => {
    axios.put(`/api/page?token=${params.token}`, params.page)
      .then(res => resolve(res.data))
      .catch(error => reject(error));
  });
}

function updatePageById (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.id) {
      return Promise.reject('Page id is required.');
    } else if (!params.page) {
      return Promise.reject('Page content is required.');
    } else if (!params.token) {
      return Promise.reject('Access token is required.');
    }
  }

  return new Promise((resolve, reject) => {
    axios.post(`/api/page/by-id/${params.id}?token=${params.token}`, params.page)
      .then(res => resolve(res.data))
      .catch(error => reject(error));
  });
}

function deletePageById (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.id) {
      return Promise.reject('Page id is required.');
    } else if (!params.token) {
      return Promise.reject('Access token is required.');
    }
  }

  return new Promise((resolve, reject) => {
    axios.delete(`/api/page/by-id/${params.id}?token=${params.token}`, params.page)
      .then(res => resolve(res.data))
      .catch(error => reject(error));
  });
}

function putReplyBySlug (params = {}) {
  return new Promise((resolve, reject) => {
    axios.put(`/api/page/by-slug/${params.slug}/reply`, params.data)
      .then(response => resolve(response.dat))
      .catch(error => reject(error));
  });
}

export default {
  fetchPages,
  fetchPageBySlug,
  fetchPageById,
  updatePageById,
  createPage,
  deletePageById,
  putReplyBySlug
};
