'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'
import request from './http';

class Title extends Component {
  constructor() {
    super();
    this.state = {
      blogTitle: '',
      blogSubtitle: '',
    }
    request.get('/api/common').then((xhr) => {
      let res = JSON.parse(xhr.responseText);
      this.setState(res.common);
    })
  }

  render() {
    return (
      <div id="title" className="alwaysShow">
        <h1><Link to="/"> { this.state.blogTitle } </Link></h1>
        <h2> { this.state.blogSubtitle } </h2>
      </div>
    )
  }
}

module.exports = Title;