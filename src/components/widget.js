'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'
import request from '../utils/http';

class Widgets extends Component {
  constructor() {
    super();
    this.state = {
      widgetsArray: [],
    }
    this.initialized = false;;
    request.get('/api/widget').then((xhr) => {
      let res = JSON.parse(xhr.responseText);
      this.setState({
        widgetsArray: res.dataset,
      });
    })
  }

  componentDidUpdate() {
    if (this.initialized)
      return;
    
    let externScript = /<script src="([^]+?)"><\/script>/i;

    this.state.widgetsArray.forEach(widget => {
      let {content} = widget;
      
      /<script/.test(content) && content.match(/<script([^]+?)\/script>/ig).forEach(res => {
        if (externScript.test(res)) {
          let node = document.createElement('SCRIPT');
          node.src = res.match(externScript)[1];
          document.body.appendChild(node);
        } else {
          let node = document.createElement('SCRIPT');
          node.innerHTML = `(function() {${res.match(/<script>([^]+?)<\/script>/i)[1]}})()`;
          document.body.appendChild(node);
        }
      })
      this.initialized = true;
    })
  }
  componentWillUnmount() {
  }
  render() {
    return (
      <div id="widgets">
        {
          this.state.widgetsArray.map((widget, offset) => {
            return (
              <div className="eachwidget" key={ offset }>
                <h3 className="blockTitle"> { widget.title || ' ' /* keep a blank space for margin. */ } </h3>
                <div dangerouslySetInnerHTML={{ __html: widget.content}}></div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

module.exports = Widgets;