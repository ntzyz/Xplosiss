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
      page: null
    }
  }

  refresh(props) {
    let query = [`page=${props.location.query.page || 1}`];

    if (props.params.categoryName) {
      query.push(`category=${encodeURIComponent(props.params.categoryName)}`);
    } else if (props.params.tagName) {
      query.push(`tag=${encodeURIComponent(props.params.tagName)}`);
    }
    
    query = '?' + query.join('&');    

    request.get(`/api/post${query}`).then((xhr) => {
      let res = JSON.parse(xhr.responseText);
      this.setState({
        postsArray: res.dataset,
        pages: res.pages,
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
                {
                  post.category ? <span>分类：{post.category}　</span> : null
                }
                {post.tags.map(tag => { return <span key={`${tag}`}>#<Link style={{marginRight: '0.5em'}} to={`/tag/${tag}`}>{tag}</Link></span>})}
              </h2>
              <div dangerouslySetInnerHTML={{__html: post.content.content}} className="postBody"></div>
              <Link to={`/post/${post.title}`}><button className="more">MORE</button></Link>
            </div>
          )
        })
      }
      <div className="pagenation"></div>
      {
        this.state.pages && this.state.pages.current !== 0
         ? <button style={{float: 'left'}}><Link to={`?page=${this.state.pages.current}`}>← Newer</Link></button>
         : null 
      } { 
        this.state.pages && this.state.pages.current + 1 !== this.state.pages.count 
        ? <button style={{float: 'right'}}><Link to={`?page=${this.state.pages.current + 2}`}>Older →</Link></button> 
        : null 
      }
      </div>
    )
  }
}

export default PostList;