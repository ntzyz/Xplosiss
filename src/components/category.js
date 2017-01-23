'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import request from '../utils/http';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';

class Category extends Component {
  constructor() {
    super();
    this.state = {
      categorys: [],
    }
    request.get('/api/category').then((xhr) => {
      let res = JSON.parse(xhr.responseText);
      this.setState({
        categorys: res.dataset.sort()
      })
    })
  }

  render() {
    return (
      <div>
        <h3 className="blockTitle">Category</h3>
        <ul>
          {
            this.state.categorys.map((category, offset) => {
              return (
                <Link key={offset} to={`/category/${category}`}><li> {category} </li></Link>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default Category;