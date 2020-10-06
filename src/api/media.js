import axios from 'axios';

function fetchFiles (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.token) {
      return Promise.reject('Access token is required.');
    }
  }
  return new Promise((resolve, reject) => {
    axios.get(`/api/media?token=${params.token}`)
      .then(response => resolve(response.data.files))
      .catch(error => reject(error));
  });
}

function getFileURL (file) {
  return `/api/media/${file}`;
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

  return axios.put(`/api/media/${encodeURIComponent(params.file.name)}`, fd, {
    params: {
      token: params.token,
      convert: params.convert ? 'true' : 'false',
    }
  });
}

function deleteFile (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.token) {
      return Promise.reject('Access token is required.');
    } else if (!params.file) {
      return Promise.reject('Upload body is required.');
    }
  }

  return axios.delete(`/api/media/${encodeURIComponent(params.file)}?token=${params.token}`);
}

export default {
  fetchFiles, getFileURL, uploadFile, deleteFile
};
