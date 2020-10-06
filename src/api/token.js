import axios from 'axios';

function checkToken (token) {
  return new Promise((resolve, reject) => {
    axios.get(`/api/token/check?token=${token}`)
      .then(response => resolve(response.data.result))
      .catch(error => reject(error));
  });
}

function forgotToken () {
  return new Promise((resolve, reject) => {
    axios.get('/api/token/forgot')
      .then(response => resolve({}))
      .catch(error => reject(error));
  });
}

export default {
  checkToken, forgotToken
};
