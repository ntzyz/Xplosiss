import axios from 'axios';
import config from '../config';

function putReplyBySlug (params) {
  return new Promise((resolve, reject) => {
    axios.put(`${config.api.url}/post/by-slug/${params.slug}/reply`, params.data)
    .then(response => resolve(response.dat))
    .catch(error => reject(error))
  })
}

function fetchLatestReplies (param = {}) {
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.url}/reply/latest`)
    .then(response => resolve(response.data.replies))
    .catch(error => reject(error))
  })
}

export default {
  putReplyBySlug, fetchLatestReplies
}