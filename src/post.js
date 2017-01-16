'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'
import request from './http';

class Post extends Component {
  constructor() {
    super();
    this.state = {
      post: {},
    }
  }

  refresh(props) {
    let title = props.params.title;
    request.get(`/api/post?title=${title}`).then((xhr) => {
      let res = JSON.parse(xhr.responseText);
      if (typeof res.dataset[0] === 'undefined') {
        this.setState({
          post: {
            title: '404',
            category: '',
            tags: [],
            content: {
              encoding: 'HTML',
              content: '喵喵喵？'
            }
          }
        })
      }
      else {
        this.setState({
          post: res.dataset[0]
        })
      }
    })
  }

  componentWillMount() {
    this.refresh(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.refresh(nextProps);
  }

  render() {
    if (typeof this.state.post.title === 'undefined') {
      return null;
    }
    return (
      <div className="posts">
        <div className="eachpost">
          <h1 className="postTitle">{ this.state.post.title }</h1>
          <h2 className="postMeta">
            分类：{this.state.post.category}　
            标签：{this.state.post.tags.map(tag => { return <Link style={{marginRight: '0.5em'}} key={`${tag}`} to={`/tag/${tag}`}>{tag}</Link>})}
          </h2>
          <div dangerouslySetInnerHTML={{__html: this.state.post.content.content}}></div>
        </div>
      </div>
    )
  }
}

export default Post;