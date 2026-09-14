import React from 'react';
import { Link } from "react-router-dom";
import Constants from './../constants/constants.jsx';

class DetailPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postId : props.match.params.postId,
      user: props.user || {}
    };
  };

  render() {
    let userId = this.state.user.uid;
    if (this.state.post !== undefined){
      const post = Array.isArray(this.state.post.data)
        ? this.state.post.data[0]
        : this.state.post.data;
      const included = this.state.post.included || [];
      const author = included.find(item => item.type === 'user--user');
      const image = included.find(item => item.type === 'file--file');
      const authorName = author && author.attributes && author.attributes.name;

      if (!post) {
        return <p>Post not found.</p>;
      }

      return (
        <div className = "post-detail">
          <h2>{post.attributes.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: post.attributes.body.value }} />
          {!!image && image.attributes.uri && image.attributes.uri.url &&
            <img alt ={post.attributes.title} src = {Constants.APP_DOMAIN + image.attributes.uri.url}></img>
          }
          <ul>
            <li>Created: {post.attributes.created}</li>
            {!!authorName && <li>Created by: {authorName}</li>}
          </ul>
          {userId && author && userId === author.id &&
            <div>
              <Link to={`/post-edit/${post.id}`}>
                Edit Post
              </Link>
              <br></br>
              <Link to={
                {
                  pathname: `/post-delete/${post.id}`,
                  state: { postName: post.attributes.title }
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
    fetch(url, { credentials: 'include' })
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