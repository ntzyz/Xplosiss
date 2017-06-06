import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
import Blog from './components/blog';
import PostList from './components/post-list';
import Post from './components/post';
import NotFound from './components/notfound';
import Editor from './components/editor';

import './utils/scrollFix';
import './styles/index';

function handleUpdate() {
  window.scrollTo(0, 0);
}

ReactDOM.render((
  <Router onUpdate={handleUpdate} history={browserHistory}>
    <Route path="/" component={Blog}>
      <IndexRoute component={PostList} />
      <Route path="/category/:categoryName" component={PostList} />
      <Route path="/tag/:tagName" component={PostList} />
      <Route path="/post/:year/:month/:date/:slug" component={Post} />
      <Route path="/edit/:slug" component={Editor} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
), document.querySelector('div#main'));
