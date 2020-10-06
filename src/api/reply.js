import axios from 'axios';

function fetchLatestReplies (param = {}) {
  return new Promise((resolve, reject) => {
    axios.get('/api/reply/latest')
      .then(response => resolve(response.data.replies))
      .catch(error => reject(error));
  });
}

export default {
  fetchLatestReplies
};
