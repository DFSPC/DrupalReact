import React from 'react';
import { Link } from "react-router-dom";
import Constants from './../constants/constants.js';

class DetailPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postId : props.match.params.postId,
      user: props.user
    };
    console.log("this.state.post", this.state.post);
  };

  render() {
    let userId = this.state.user.uid;
    console.log("this.state.post", this.state.post);
    if (this.state.post !== undefined){
      return (
        <div className = "post-detail">
          <h2>{this.state.post.data.attributes.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: this.state.post.data.attributes.body.value }} />
          {!!this.state.post.included[1] &&
            <img alt ={this.state.post.data.attributes.title} src = {Constants.APP_DOMAIN + this.state.post.included[1].attributes.uri.url}></img>
          }
          <ul>
            <li>Created: {this.state.post.data.attributes.created}</li>
            <li>Created by: {this.state.post.included[0].attributes.name}</li>
          </ul>
          {userId && userId === this.state.post.included[0].id &&
            <div>
              <Link to={`/post-edit/${this.state.post.data.id}`}>
                Edit Post
              </Link>
              <br></br>
              <Link to={
                {
                  pathname: `/post-delete/${this.state.post.data.id}`,
                  postName: this.state.post.data.attributes.title
                  }
              }>
                Delete Post
              </Link>
            </div>
          }
        </div>
      );
    }else{
      return (
        <p>Loading...</p>
      )
    }
  }

  componentDidMount() {
    let url = Constants.APP_DOMAIN_POSTS + '/' + this.state.postId + '?fields[user--user]=name,mail,uid&fields[file--file]=uri,url&include=uid,field_image';
    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          post: result
        });
      }
    )
  }
}

export default DetailPost;