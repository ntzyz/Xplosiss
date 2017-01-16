import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Background from './background';
import Title from './title';
import Search from './search';
import Category from './category'
import Tags from './tags';

class Blog extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Background />
        <div id="container">
          <div id="left">
            <Title />
            <hr />
            <Search />
            <Category />
            <Tags />
          </div>
          <div id="right">
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }

}

export default Blog;