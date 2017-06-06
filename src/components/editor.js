'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'
import request from '../utils/http';

class Editor extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    request.get(`/api/post?slug=${encodeURIComponent(this.props.params.slug)}&full=true`).then((xhr) => {
      let res = JSON.parse(xhr.responseText);
      if (res.status === 'ok' && res.dataset.length === 1) {
        res.dataset[0].date = new Date(res.dataset[0].date);
        this.setState({post: res.dataset[0]})
      }
    });
  }

  render () {
    if (typeof this.state.post === 'undefined') {
      return null;
    }
    return (
      <div id="editor">
        <table><tbody>
          <tr><td className="label">文章标题：</td><td><input value={ this.state.post.title } readOnly={ true }/></td></tr>
          <tr><td className="label">英文缩写：</td><td><input value={ this.state.post.slug } readOnly={ true }/></td></tr>
          <tr><td className="label">标签（空格隔开）：</td><td><input value={ this.state.post.tags.join(' ') } readOnly={ true }/></td></tr>
          <tr><td className="label">日期：</td><td><input value={ `${this.state.post.date.getFullYear()}-${this.state.post.date.getMonth() + 1}-${this.state.post.date.getDate()}` } readOnly={ true }/></td></tr>
          <tr><td className="label">文章内容：</td><td><textarea value={ this.state.post.content.content } readOnly={ true }/></td></tr>
          <tr><td className="label"></td><td><button>保存</button></td></tr>
        </tbody></table>
      </div>
    )
  }
}

export default Editor;