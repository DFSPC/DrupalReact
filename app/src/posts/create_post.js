import React from 'react';
import { Navigate, Link } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import Constants from './../constants/constants.js';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      thumb: null
    };
  };

  render(){
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    if (this.state.user.token != null){
      return (
        <div className="create-post">
          <h2>Create a post</h2>
          <Formik
            initialValues={{ title: "", body: "" }}
            onSubmit= {(values) => {
              this.createPost(values);
            }}
          >
            {({setFieldValue }) => {
              return (
              <Form>
                <Field name="title" type="text" placeholder="Title"/>
                <br></br>
                <Field name="body" component="textarea" placeholder="Description"/>
                <br></br>
                <input id="file" name="file" type="file" onChange={(event) => {
                  setFieldValue("file", event.currentTarget.files[0]);
                  let reader = new FileReader();
                  reader.onloadend = () => {
                    this.setState({thumb: reader.result });
                  };
                  reader.readAsDataURL(event.currentTarget.files[0]);
                }} className="form-control" />
                <br></br>
                {this.state.thumb != null  &&
                  <img src={this.state.thumb} alt="preview" className="img-thumbnail mt-2" height={200}width={200} />
                }
                <br></br>
                <Field name="submit" type="submit" value ="Create" />
              </Form>
              );
            }}
          </Formik>
        </div>
      )
    }else{
      return(
        <p>You are not logged, please <Link to="/login">login</Link> for make a post</p>
      )
    }
  }

  createPost(values){
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({image: reader.result });
      let self = this;
      let data = {
        "data": {
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
      let obj = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json',
          'Authorization': ' Basic ' + this.state.user.token
        },
        body: JSON.stringify(data),
      };

      fetch(Constants.APP_DOMAIN_POSTS, obj)
      .then(function(res) {
        return res.json();
      })
      .then(function(resJson) {
        let postId = resJson.data.id;
        let obj = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Accept': 'application/vnd.api+json',
            'Content-Disposition': 'file; filename="' + values.file.name + '"',
            'Authorization': ' Basic ' + self.state.user.token
          },
          body: self.state.image,
        };
        let url = Constants.APP_DOMAIN_POSTS + '/' + postId + '/field_image';
        fetch(url, obj)
        .then(function(res) {
          return res.json();
        })
        .then(function(resJson) {
          self.setState({ redirect: "/post/" + postId});
        })
      })
    };
    reader.readAsArrayBuffer(values.file);
  }
}

export default CreatePost;