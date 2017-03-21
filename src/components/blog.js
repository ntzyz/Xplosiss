import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Background from './background';
import Title from './title';
import Search from './search';
import Category from './category'
import Tags from './tags';
import Widgets from './widget';

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
            <Title ref="title"/>
            <hr />
            <Search />
            <Category />
            <Tags />
            <Widgets />
          </div>
          <div id="right">
            { this.props.children }
          </div>
        </div>
        <div id="footer">Powered by ntzyz 2016-2017.</div>
      </div>
    )
  }

}

export default Blog;