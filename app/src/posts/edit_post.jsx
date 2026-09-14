import React from 'react';
import { Navigate , Link} from "react-router-dom";
import { Formik, Field, Form } from "formik";
import Constants from './../constants/constants.jsx';

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

  render(){
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    if (this.state.user.uid != null){
      if (this.state.error) {
        return <p>{this.state.error}</p>;
      }
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
        'Authorization': 'Basic ' + this.state.user.token,
        'X-CSRF-Token': this.state.user.csrfToken
      },
      credentials: 'include',
      body: JSON.stringify(data),
    };

    fetch(url, obj)
    .then(res => res.json().then(body => ({ ok: res.ok, body: body })))
    .then(function(response) {
      if (!response.ok) {
        const error = response.body.errors && response.body.errors[0];
        throw new Error(error ? error.detail || error.title : 'Unable to edit the post.');
      }
      self.setState({ redirect: "/post/" + self.state.postId });
    })
    .catch(error => self.setState({ error: error.message }));
  }
}

export default EditPost;