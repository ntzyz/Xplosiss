'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import request from '../utils/http';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'

class Tags extends Component {
  constructor() {
    super();
    this.state = {
      tags: [],
    }
    request.get('/api/tag').then((xhr) => {
      let res = JSON.parse(xhr.responseText);
      this.setState({
        tags: res.dataset.sort()
      })
    })
  }

  render() {
    return (
      <div>
        <h3 className="blockTitle">Tags</h3>
        <div id="tags">
          {
            this.state.tags.map((tags, offset) => {
              return (
                <span key={offset}><Link key={offset} to={`/tag/${tags}`}> {tags} </Link></span>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default Tags;