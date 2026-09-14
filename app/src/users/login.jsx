import React from 'react';
import { Navigate } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import base64 from 'react-native-base64'
import Constants from './../constants/constants.jsx';

class Login extends React.Component {
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
        <div className="login-user">
        <h2>Login</h2>
        <Formik
            initialValues={{ user: "", password: "" }}
            onSubmit= {(values) => {
              this.userLogin(values);
            }}
          >
          <Form>
            <Field name="user" type="text" placeholder="User"/>
            <br></br>
            <Field name="password" type="password" placeholder="Password"/>
            <br></br>
            <Field name="submit" type="submit" value ="Login" />
          </Form>
        </Formik>
        </div>
      )
    }else{
      return(
        <div className="login-user">
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

  userLogin(values){
    let self = this;
    let data = {
      "name": values.user, 
      "pass": values.password}
    let obj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    };

    fetch(Constants.APP_DOMAIN_USER_LOGIN, obj)
    .then(function(res) {
      return res.json().then(body => ({ ok: res.ok, status: res.status, body: body }));
    })
    .then(function(response) {
      if (!response.ok) {
        const error = response.body.errors && response.body.errors[0];
        throw new Error(error ? error.detail || error.title : `Login failed (${response.status}).`);
      }
      const resJson = response.body;
      if (!!resJson.csrf_token){
        fetch(Constants.APP_DOMAIN_USER_INFO, { credentials: 'include' })
        .then(res => res.json())
        .then(result => {
          const apiUser = result.data.find(item =>
            item.attributes && item.attributes.display_name === resJson.current_user.name
          );
          const user = {
            uid: apiUser ? apiUser.id : resJson.current_user.uid,
            internalUid: resJson.current_user.uid,
            name: resJson.current_user.name,
            token: base64.encode(values.user + ':' + values.password),
            csrfToken: resJson.csrf_token,
            logoutToken: resJson.logout_token
          };
          self.setState({ user: user, redirect: "/posts-me" });
          self.props.updateUser(user);
        });
      }else{
        return false;
      }
    })
    .catch(error => self.setState({ error: error.message }));
  }

  userLogout(values){
    const user = {
      uid: null,
      name: null,
      token: null,
      csrfToken: null
    };
    const logoutUrl = this.state.user.logoutToken
      ? Constants.APP_DOMAIN_USER_LOGOUT + '?token=' + encodeURIComponent(this.state.user.logoutToken)
      : Constants.APP_DOMAIN_USER_LOGOUT;
    fetch(logoutUrl, { credentials: 'include' })
      .catch(() => {})
      .finally(() => {
        this.setState({ user: user });
        this.props.updateUser(user);
      });
  }
}

export default Login;