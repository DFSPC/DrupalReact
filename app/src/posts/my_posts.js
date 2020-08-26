import React from 'react';
import { Link } from "react-router-dom";
import Posts from './../posts/posts.js';

class MyPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      user: props.user
    };
  };

  render(){
    if (this.state.user.uid == null){
      return(
        <p>You are not logged, please <Link to="/login">login</Link> for view your posts</p>
      )
    }else{
      return (
        <div className = "my-post">
          <h2>My posts</h2>
          <Posts userId = {this.state.user.uid}/>
        </div>
      );
    }
  }
}

export default MyPosts;