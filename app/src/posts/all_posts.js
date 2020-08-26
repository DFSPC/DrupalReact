import React from 'react';
import Posts from './../posts/posts.js';

class AllPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  };

  render(){
    return (
      <div className = "all-post">
        <h2>Posts</h2>
        <Posts/>
      </div>
    );
  }
}

export default AllPosts;