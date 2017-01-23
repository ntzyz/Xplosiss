'use strict';


function common(method, url, data, options) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    options = options || {};
    xhr.open(method, url);

    if (/POST|PUT/i.test(method)) {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    if (data && typeof data === 'object') {
      let pairs = [];
      if (data instanceof FormData) {
        for(let pair of data.entries()) {
          pairs.push(encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]));
        }
      }
      else {
        for(let key in data) {
          pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
      }
      data = pairs.join('&');
    }

    if (options.before) {
      options.before(xhr);
    }

    xhr.onreadystatechange = function() {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          resolve(xhr);
        }
        else {
          reject(xhr);
        }
      }
    };

    xhr.send(data);
  });
}

let request = {};

request.get = function(url, options) {
  return common('GET', url, undefined, options);
}

request.post = function(url, data, options) {
  return common('POST', url, data, options);
}

request.put = function(url, data, options) {
  return common('PUT', url, data, options);
}

request.delete = function(url, options) {
  return common('DELETE', url, undefined, options);
}

request.head = function(url, options) {
  return common('HEAD', url, undefined, options);
}

export default request;
