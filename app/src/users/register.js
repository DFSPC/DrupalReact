import React from 'react';
import { Redirect } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import base64 from 'react-native-base64'
import Constants from './../constants/constants.js';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user : props.user
    };
  };
  render() {
    if (this.state.redirect){
      return <Redirect to={this.state.redirect} />
    }
    if (this.state.user.token == null){
      return (
        <div className="register-user">
        <h2>Register</h2>
        <Formik
            initialValues={{ user: "", mail: "", password: "" }}
            onSubmit= {(values) => {
              this.userRegister(values);
            }}
          >
          <Form>
            <Field name="user" type="text" placeholder="User" />
            <br></br>
            <Field name="mail" type="mail" placeholder="Email"/>
            <br></br>
            <Field name="password" type="password" placeholder="Password"/>
            <br></br>
            <Field name="submit" type="submit" value ="Register" />
          </Form>
        </Formik>
        </div>
      )
    }else{
      return(
        <div className="register-user">
          <p>You are logged as {this.state.user.name}</p>
          <Formik
              initialValues={{ user: ""}}
              onSubmit= {(values) => {
                this.userLogout(values);
              }}
            >
            <Form>
              <Field name="submit" type="submit" value ="Logout" />
            </Form>
          </Formik>
        </div>
      )
    }
  }

  userRegister(values){
    let self = this;
    let data = {
      "name": [
        {"value": values.user}
      ],
      "mail": [
        {"value": values.mail}
      ],
      "pass": [
        {"value": values.password}
      ]
    };
    let obj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    fetch(Constants.APP_DOMAIN_USER_REGISTER, obj)
    .then(function(res) {
      return res.json();
    })
    .then(function(resJson) {
      if (!!resJson.uuid[0].value){
        self.setState({
          user :{
            uid: resJson.uuid[0].value,
            name: resJson.name[0].value,
            token : base64.encode(values.user + ':' + values.password)
          }
        });
        self.props.updateUser(self.state.user);
        self.setState({ redirect: "/posts-me" });
      }else{
        return false;
      }
    })
  }

  userLogout(values){
    this.setState({
      user :{
        uid: null,
        name: null,
        token: null
      }
    });
    this.props.updateUser(this.state.user);
  }
}

export default Register;