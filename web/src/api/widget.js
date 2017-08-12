import axios from 'axios';
import config from '../config';

function fetchWidgetList (params) {
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/widget`)
    .then(response => resolve(response.data.widgets))
    .catch(err => reject(error));
  });
}

export default {
  fetchWidgetList
}
