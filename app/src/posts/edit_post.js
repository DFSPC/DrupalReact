import React from 'react';
import { Redirect , Link} from "react-router-dom";
import { Formik, Field, Form } from "formik";
import Constants from './../constants/constants.js';

class EditPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postId : props.match.params.postId,
      user: props.user
    };
  };

  componentDidMount() {
    let url = Constants.APP_DOMAIN_POSTS + '/' + this.state.postId + '?fields[user--user]=name,mail,uid&include=uid';
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

  render(){
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    if (this.state.user.uid != null){
      if (this.state.post !== undefined){
        return (
          <div className="edit-post">
            <h2>Edit a post</h2>
            <Formik
              initialValues={{ title: this.state.post.data.attributes.title, body: this.state.post.data.attributes.body.value }}
              onSubmit= {(values) => {
                this.editPost(values);
              }}
            >
              <Form>
                <Field name="title" type="text" placeholder="Title"/>
                <br></br>
                <Field name="body" component="textarea" placeholder="Description"/>
                <br></br>
                <Field name="submit" type="submit" value ="Edit" />
              </Form>
            </Formik>
            <Link to={`/post/${this.state.postId}`}>
              Cancel
            </Link>
          </div>
        )
      }else{
        return (
          <p>Loading...</p>
        )
      }
    }else{
      return(
        <p>You are not logged, please <Link to="/login">login</Link> for make a post</p>
      )
    }
  }

  editPost(values){
    let self = this;
    let data = {
      "data": {
        "id": self.state.postId,
        "type": "node--article",
        "attributes": {
          "title": values.title,
          "body": {
            "value": values.body,
            "format": "plain_text"
          }
        }
      }
    }
    let url = Constants.APP_DOMAIN_POSTS + '/' + self.state.postId
    let obj = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
        'Authorization': ' Basic ' + this.state.user.token
      },
      body: JSON.stringify(data),
    };

    fetch(url, obj)
    .then(function(res) {
      return res.json();
    })
    .then(function(resJson) {
      self.setState({ redirect: "/post/" + self.state.postId });
    })
  }
}

export default EditPost;