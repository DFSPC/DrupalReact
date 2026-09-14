import React from 'react';
import { Navigate } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import Constants from './../constants/constants.jsx';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user : props.user
    };
  };
  render() {
    if (this.state.redirect){
      return <Navigate to={this.state.redirect} />
    }
    if (this.state.error) {
      return <p>{this.state.error}</p>;
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
      data: {
        type: 'user--user',
        attributes: {
          name: values.user,
          mail: values.mail,
          pass: values.password
        }
      }
    };
    let obj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      },
      credentials: 'include',
      body: JSON.stringify(data),
    };

    fetch(Constants.APP_DOMAIN_USER_REGISTER, obj)
    .then(res => res.json().then(body => ({ ok: res.ok, status: res.status, body: body })))
    .then(function(response) {
      if (!response.ok) {
        const error = response.body.message ||
          (response.body.errors && response.body.errors[0] && response.body.errors[0].detail) ||
          `Registration failed (${response.status}).`;
        throw new Error(error);
      }
      const resJson = response.body;
      if (resJson.data && resJson.data.id){
        self.setState({ redirect: "/login" });
      }else{
        throw new Error('Registration response did not include a user ID.');
      }
    })
    .catch(error => self.setState({ error: error.message }));
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