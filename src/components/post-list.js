'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'
import request from '../utils/http';

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
    let title = '首页';

    if (props.params.categoryName) {
      title = `分类：${props.params.categoryName}`;
      query.push(`category=${encodeURIComponent(props.params.categoryName)}`);
    } else if (props.params.tagName) {
      title = `标签：${props.params.tagName}`;
      query.push(`tag=${encodeURIComponent(props.params.tagName)}`);
    }

    // TODO: remove this hard string.
    document.title = title + ' - namespace ntzyz;';
    query = '?' + query.join('&');    

    request.get(`/api/post${query}`).then((xhr) => {
      let res = JSON.parse(xhr.responseText);
      res.dataset.forEach(item => item.date = new Date(item.date));
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
              <h1 className="postTitle"> <Link to={`/post/${post.date.getFullYear()}/${post.date.getMonth() + 1}/${post.date.getDate()}/${post.slug}`}>{ post.title }</Link> </h1>
              <h2 className="postMeta">
                日期：{`${post.date.getFullYear()}-${post.date.getMonth() + 1}-${post.date.getDate()}`}　
                {
                  post.category ? <span>分类：{post.category}　</span> : null
                }
                {post.tags.map(tag => { return <span key={`${tag}`}>#<Link style={{marginRight: '0.5em'}} to={`/tag/${tag}`}>{tag}</Link></span>})}
              </h2>
              <div dangerouslySetInnerHTML={{__html: post.content.content}} className="postBody"></div>
              <Link to={`/post/${post.date.getFullYear()}/${post.date.getMonth() + 1}/${post.date.getDate()}/${post.slug}`}><button className="more">MORE</button></Link>
            </div>
          )
        })
      }
      <div className="pagenation"> {
        this.state.pages && this.state.pages.current !== 0
        ? <Link to={`${location.pathname}?page=${this.state.pages.current}`}><button style={{float: 'left'}}>Page--</button></Link>
        : null 
      } { 
        this.state.pages && this.state.pages.current + 1 !== this.state.pages.count 
        ? <Link to={`${location.pathname}?page=${this.state.pages.current + 2}`}><button style={{float: 'right'}}>Page++</button> </Link>
        : null 
      } </div>
      </div>
    )
  }
}

export default PostList;