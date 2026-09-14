import React from 'react';
import {
  Link
} from "react-router-dom";
import Constants from './../constants/constants.jsx';

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      userId: props.userId,
      user: props.user
    };
  };

  render(){
    return (
      <div className = "list-posts">
        {this.state.posts.length === 0
          ? <p>No posts found.</p>
          : <ul>
              {this.state.posts.map(post => (
                <li key={post.id}>
                  <Link to={`/post/${post.id}`}>
                    <h3>{post.attributes.title}</h3>
                  </Link>
                </li>
              ))}
            </ul>
        }
      </div>
    );
  }

  componentDidMount() {
    let url = Constants.APP_DOMAIN_POSTS + '?sort=-nid';
    if (!!this.state.userId){
      if (this.state.user && this.state.user.internalUid) {
        url += '&filter[uid.meta.drupal_internal__target_id][value]=' + this.state.user.internalUid;
      } else {
        url += '&filter[uid.id][value]=' + this.state.userId;
      }
    }
    const headers = this.state.user && this.state.user.token
      ? { Authorization: ' Basic ' + this.state.user.token }
      : {};
    fetch(url, { credentials: 'include', headers: headers })
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