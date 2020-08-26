import React from 'react';
import {
  Link
} from "react-router-dom";
import Constants from './../constants/constants.js';

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      userId: props.userId
    };
  };

  render(){
    return (
      <div className = "list-posts">
        <ul>
          {this.state.posts.map(post => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`}>
                <h3>{post.attributes.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  componentDidMount() {
    let url = Constants.APP_DOMAIN_POSTS + '?sort=-nid';
    if (!!this.state.userId){
      url += '&filter[uid.id][value]=' + this.state.userId;
    }
    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          posts: result.data
        });
      }
    )
  }
}

export default Posts;