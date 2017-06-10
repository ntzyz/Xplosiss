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
        let date = new Date(res.dataset[0].date);
        res.dataset[0].year = date.getFullYear();
        res.dataset[0].month = date.getMonth() + 1;
        res.dataset[0].day = date.getDay();
        res.dataset[0].encoding = res.dataset[0].content.encoding;
        res.dataset[0].content = res.dataset[0].content.content;
        this.setState(res.dataset[0])
      }
    });
  }

  update(prop) {
    return (event) => {
      let newState = {};
      newState[prop] = event.target.value;
      this.setState(newState);
    }
  }

  render () {
    if (typeof this.state.title === 'undefined') {
      return null;
    }
    return (
      <div id="editor">
        <table><tbody>
          <tr>
            <td className="label">文章标题：</td>
            <td><input spellCheck="false" value={ this.state.title } onChange={ this.update('title') }/></td>
          </tr>
          <tr>
            <td className="label">英文缩写：</td>
            <td><input spellCheck="false" value={ this.state.slug } onChange={ this.update('slug') }/></td>
          </tr>
          <tr>
            <td className="label">标签：</td><td><input value={ this.state.tags.join(' ') } readOnly={ true }/></td>
          </tr>
          <tr>
            <td className="label">日期：</td>
            <td>
              <input spellCheck="false" className="inline" value={ this.state.year } onChange={ this.update('year') }/>
              <span> 年 </span>
              <input spellCheck="false" className="inline" value={ this.state.month } onChange={ this.update('month') }/>
              <span> 月 </span>
              <input spellCheck="false" className="inline" value={ this.state.day } onChange={ this.update('day') }/>
              <span> 日 </span>
            </td>
          </tr>
          <tr>
            <td className="label">文章内容：</td>
            <td><textarea spellCheck="false" value={ this.state.content } onChange={ this.update('content') }/></td>
          </tr>
          <tr>
            <td className="label"></td>
            <td><button>保存</button><button style={ {float: 'right'} }>删除文章</button></td>
          </tr>
        </tbody></table>
      </div>
    )
  }
}

export default Editor;