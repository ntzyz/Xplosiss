import React, { Component } from 'react';
import ReactDOM from 'react-dom';

        
class Search extends Component {
  constructor() {
    super();
  }

  search() {
    console.log(`Now searching ${document.querySelector('input.search').value}`);
  }

  render() {
    return (
      <div className="searchWrapper">
        <div className="inputWrapper">
          <input className="search" type="text" placeholder="Search here" />
        </div>
        <button className="search" onClick={ this.search }>Go!</button>
      </div>
    )
  }
}

export default Search;