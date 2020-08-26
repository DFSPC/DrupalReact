import React from 'react';
import { Redirect } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import base64 from 'react-native-base64'
import Constants from './../constants/constants.js';

class Login extends React.Component {
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
      body: JSON.stringify(data),
    };

    fetch(Constants.APP_DOMAIN_USER_LOGIN, obj)  
    .then(function(res) {
      return res.json();
    })
    .then(function(resJson) {
      if (!!resJson.csrf_token){
        let url = Constants.APP_DOMAIN_USER_INFO + '?filter[uid][value]=' + resJson.current_user.uid;
        fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            self.setState({
              user :{
                uid: result.data[0].id,
                name: resJson.current_user.name,
                token : base64.encode(values.user + ':' + values.password)
              }
            });
            self.props.updateUser(self.state.user);
            self.setState({ redirect: "/posts-me" });
          }
        )
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

export default Login;