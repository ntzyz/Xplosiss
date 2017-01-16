'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'
import request from './http';

class PostList extends Component {
  constructor() {
    super();
    this.state = {
      postsArray: [],
    }
  }

  refresh(props) {
    let query = ''
    if (props.params.categoryName) {
      query = `?category=${encodeURIComponent(props.params.categoryName)}`;
    } else if (props.params.tagName) {
      query = `?tag=${encodeURIComponent(props.params.tagName)}`;
    } else {
      query = '';
    }
    request.get(`/api/post${query}`).then((xhr) => {
      let res = JSON.parse(xhr.responseText);
      this.setState({
        postsArray: res.dataset,
      })
    })
  }

  componentWillMount() {
    this.refresh(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.refresh(nextProps);
  }

  render() {
    return (
      <div className="posts"> {
        this.state.postsArray.map(post => {
          return (
            <div className="eachpost" key={`post-${post._id}`}>
              <h1 className="postTitle"> <Link to={`/post/${post.title}`}>{ post.title }</Link> </h1>
              <h2 className="postMeta">
                分类：{post.category}　
                标签：{post.tags.map(tag => { return <Link style={{marginRight: '0.5em'}} key={`${tag}`} to={`/tag/${tag}`}>{tag}</Link>})}
              </h2>
              <div dangerouslySetInnerHTML={{__html: post.content.content}}></div>
              <Link to={`/post/${post.title}`}><button className="more">MORE</button></Link>
            </div>
          )
        })
      } </div>
    )
  }
}

export default PostList;