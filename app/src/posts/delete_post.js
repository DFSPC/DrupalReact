import React from 'react';
import { Link, Redirect } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import Constants from './../constants/constants.js';

class DeletePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postId : props.match.params.postId,
      postName : props.location.postName,
      user: props.user
    };
  };

  render() {
    if (this.state.user.token == null){
      return <Redirect to='/login' />
    }
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className = "post-delete">
        <h2>Are you sure you wanna delete <em>{this.state.postName}</em>?</h2>
        <Formik
            initialValues={{ postId: this.state.postId}}
            onSubmit= {(values) => {
              this.deletePost(values);
            }}
          >
          <Form>
            <Field name="submit" type="submit" value ="Delete" />
          </Form>
        </Formik>
        <Link to={`/post/${this.state.postId}`}>
          Cancel
        </Link>
      </div>
    );
  }

  deletePost(values){
    let self = this;
    let url = Constants.APP_DOMAIN_POSTS + '/' + values.postId;
    let obj = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
        'Authorization': ' Basic ' + this.state.user.token
      }
    };

    fetch(url, obj)
    .then(function(res) {
      self.setState({ redirect: "/posts-me" });
    })
  }
}

export default DeletePost;