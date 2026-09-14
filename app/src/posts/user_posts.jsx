import React from 'react';
import Posts from './../posts/posts.jsx';

class UserPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      userId : props.match.params.userId,
      userName: props.location.state && props.location.state.userName
    };
  };

  render(){
    return (
      <div className = "my-post">
        <h2>{this.state.userName} posts</h2>
        <Posts userId = {this.state.userId}/>
      </div>
    );
  }
}

export default UserPosts;