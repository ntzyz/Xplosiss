import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
import Blog from './blog';
import PostList from './post-list';
import Post from './post';

import './style.css';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Blog}>
      <IndexRoute component={PostList} />
      <Route path="/category/:categoryName" component={PostList} />
      <Route path="/tag/:tagName" component={PostList} />
      <Route path="/post/:title" component={Post} />
      <Route path="*" component={Post} />
    </Route>
  </Router>
), document.querySelector('div#main'));
