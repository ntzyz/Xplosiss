import axios from 'axios';

function fetchLogs (params = {}) {
  if (process.env.NODE_ENV === 'development') {
    if (!params.token) {
      return Promise.reject('Access token is required.');
    }
  }
  return new Promise((resolve, reject) => {
    axios.get(`/api/logs?token=${params.token}`)
      .then(response => resolve(response.data.logs))
      .catch(error => reject(error));
  });
}

export default {
  fetchLogs
};
