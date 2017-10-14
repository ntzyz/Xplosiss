import axios from 'axios';
import config from '../config';

function fetchFiles (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.token) {
      return Promise.reject('Access token is required.');
    }
  }
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/media?token=${params.token}`)
      .then(response => resolve(response.data.files))
      .catch(error => reject(error));
  });
}

function getFileURL (file) {
  return `${config.api.url}/media/${file}`;
}

function uploadFile (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.token) {
      return Promise.reject('Access token is required.');
    } else if (!params.file) {
      return Promise.reject('Upload body is required.');
    }
  }

  let fd = new FormData();
  fd.append('file', params.file);

  return axios.put(`${config.api.url}/media/${params.file.name}?token=${params.token}`, fd);
}

function deleteFile (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.token) {
      return Promise.reject('Access token is required.');
    } else if (!params.file) {
      return Promise.reject('Upload body is required.');
    }
  }

  return axios.delete(`${config.api.url}/media/${params.file}?token=${params.token}`);
}

export default {
  fetchFiles, getFileURL, uploadFile, deleteFile
};
