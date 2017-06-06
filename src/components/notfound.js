'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import request from '../utils/http';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';

class NotFound extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div style={ {marginTop: '5px'} }>
        <h1>:(</h1>
        <h2>The page you are looking for could not be found.</h2>
      </div>
    )
  }
}

export default NotFound;