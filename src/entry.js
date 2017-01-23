import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
import Blog from './components/blog';
import PostList from './components/post-list';
import Post from './components/post';
import './utils/scrollFix';

import './styles/index';

function handleUpdate() {
  window.scrollTo(0, 0);
  return;
  let {
    action
  } = this.state.location;

  if (action === 'PUSH') {
    window.scrollTo(0, 0);
  }
}

ReactDOM.render((
  <Router onUpdate={handleUpdate} history={browserHistory}>
    <Route path="/" component={Blog}>
      <IndexRoute component={PostList} />
      <Route path="/category/:categoryName" component={PostList} />
      <Route path="/tag/:tagName" component={PostList} />
      <Route path="/post/:title" component={Post} />
      <Route path="*" component={Post} />
    </Route>
  </Router>
), document.querySelector('div#main'));
