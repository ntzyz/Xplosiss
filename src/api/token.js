import axios from 'axios';
import config from '../config.json';

function checkToken (token) {
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/token/check?token=${token}`)
      .then(response => resolve(response.data.result))
      .catch(error => reject(error));
  });
}

function forgotToken () {
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/token/forgot`)
      .then(response => resolve({}))
      .catch(error => reject(error));
  });
}

export default {
  checkToken, forgotToken
};
