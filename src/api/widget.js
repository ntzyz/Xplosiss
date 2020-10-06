import axios from 'axios';

function fetchWidgetList (params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(`/api/widget${params.all ? '/all' : ''}`)
      .then(response => resolve(response.data.widgets))
      .catch(error => reject(error));
  });
}

function updateWidget (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.id) {
      return Promise.reject('Widget id is required.');
    } else if (!params.widget) {
      return Promise.reject('Widget content is required.');
    } else if (!params.token) {
      return Promise.reject('Access token is required.');
    }
  }
  return new Promise((resolve, reject) => {
    axios.post(`/api/widget/${params.id}?token=${params.token}`, params.widget)
      .then(res => resolve(res.data))
      .catch(error => reject(error));
  });
}

function createWidget (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.widget) {
      return Promise.reject('Widget content is required.');
    } else if (!params.token) {
      return Promise.reject('Access token is required.');
    }
  }
  return new Promise((resolve, reject) => {
    axios.put(`/api/widget?token=${params.token}`, params.widget)
      .then(res => resolve(res.data))
      .catch(error => reject(error));
  });
}

function deleteWidget (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.id) {
      return Promise.reject('Widget id content is required.');
    } else if (!params.token) {
      return Promise.reject('Access token is required.');
    }
  }
  return new Promise((resolve, reject) => {
    axios.delete(`/api/widget/${params.id}?token=${params.token}`)
      .then(res => resolve(res.data))
      .catch(error => reject(error));
  });
}

export default {
  fetchWidgetList, updateWidget, createWidget, deleteWidget
};
