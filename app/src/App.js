import React from 'react';
import './App.css';
import { Formik, Field, Form } from "formik";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import base64 from 'react-native-base64'

const APP_DOMAIN                          = 'http://localhost:8000';
const APP_DOMAIN_POSTS                    = APP_DOMAIN + '/jsonapi/node/article';
const APP_DOMAIN_USER_LOGIN               = APP_DOMAIN + '/user/login?_format=json';
const APP_DOMAIN_USER_REGISTER            = APP_DOMAIN + '/user/register?_format=json';
const APP_DOMAIN_USER_INFO                = APP_DOMAIN + '/jsonapi/user/user';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      user :{
        uid: null,
        name: null,
        token : null
      }
    };
  };

  render(){
    return (
      <div className="App">
        <header className="App-header"> 
          <h1>API Drupal Test</h1>
        </header>
        <div className="menu">
          <Menu 
            posts = {this.state.posts}
            user = {this.state.user}
          />
        </div>
      </div>
    )
  };
}
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: props.posts,
      user: props.user
    };
  };
  render(){
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/posts">Posts</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
              {this.state.user.uid !== null &&
                <div>
                  <li>
                    <Link to="/create">Create Post</Link>
                  </li>
                  <li>
                    <Link to="/posts-me">My Posts</Link>
                  </li>
                </div>
              }
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/login">
              <Login 
                user = {this.state.user}
                updateUser = {this.updateUser}
              />
            </Route>
            <Route path="/register">
              <Register
                user = {this.state.user}
                updateUser = {this.updateUser}
              />
            </Route>
            <Route path="/posts">
              <AllPosts />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/create">
              <CreatePost user = {this.state.user}/>
            </Route>
            <Route path={"/posts-me"}>
              <MyPosts
                user = {this.state.user}
              />
            </Route>
            <Route
              exact path="/user/:userId"
              render={(props) => <UserPosts {...props}/>}
            />
            <Route
              exact path="/post/:postId"
              render={(props) => <DetailPost {...props} user = {this.state.user}/>}
            />
            <Route
              exact path="/post-delete/:postId"
              render={(props) => <DeletePost {...props} user = {this.state.user}/>}
            />
            <Route
              exact path="/post-edit/:postId"
              render={(props) => <EditPost {...props} user = {this.state.user}/>}
            />
          </Switch>
        </div>
      </Router>
    )
  };

  updateUser = (user) => {
    this.setState({
      user: user
    })
  }
}
class AllPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  };

  render(){
    return (
      <div className = "all-post">
        <h2>All posts</h2>
        <Posts/>
      </div>
    );
  }
}
class MyPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      user: props.user
    };
  };

  render(){
    if (this.state.user.uid == null){
      return(
        <p>You are not logged, please <Link to="/login">login</Link> for view your posts</p>
      )
    }else{
      return (
        <div className = "my-post">
          <h2>My posts</h2>
          <Posts userId = {this.state.user.uid}/>
        </div>
      );
    }
  }
}

class UserPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      userId : props.match.params.userId,
    };
  };

  render(){
    return (
      <div className = "my-post">
        <h2>User posts</h2>
        <Posts userId = {this.state.userId}/>
      </div>
    );
  }
}
class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      userId: props.userId
    };
  };

  render(){
    return (
      <div className = "list-posts">
        <ul>
          {this.state.posts.map(post => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`}>
                <h3>{post.attributes.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  componentDidMount() {
    let url = APP_DOMAIN_POSTS + '?sort=-nid';
    if (!!this.state.userId){
      url += '&filter[uid.id][value]=' + this.state.userId;
    }
    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          posts: result.data
        });
      }
    )
  }
}
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
      return <Redirect to={this.state.redirect} />
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

      fetch(APP_DOMAIN_POSTS, obj)
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
        let url = APP_DOMAIN_POSTS + '/' + postId + '/field_image';
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
class DetailPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postId : props.match.params.postId,
      user: props.user
    };
  };

  render() {
    let userId = this.state.user.uid;
    if (this.state.post !== undefined){
      return (
        <div className = "post-detail">
          <h2>{this.state.post.data.attributes.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: this.state.post.data.attributes.body.value }} />
          {!!this.state.post.included[1] &&
            <img alt ={this.state.post.data.attributes.title} src = {APP_DOMAIN + this.state.post.included[1].attributes.uri.url}></img>
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
              <Link to={`/post-delete/${this.state.post.data.id}`}>
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
    let url = APP_DOMAIN_POSTS + '/' + this.state.postId + '?fields[user--user]=name,mail,uid&fields[file--file]=uri,url&include=uid,field_image';
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
class EditPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postId : props.match.params.postId,
      user: props.user
    };
  };

  componentDidMount() {
    let url = APP_DOMAIN_POSTS + '/' + this.state.postId + '?fields[user--user]=name,mail,uid&include=uid';
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
    let url = APP_DOMAIN_POSTS + '/' + self.state.postId
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
class DeletePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postId : props.match.params.postId,
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
        <h2>Are you sure you wanna delete this post</h2>
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
      </div>
    );
  }

  deletePost(values){
    let self = this;
    let url = APP_DOMAIN_POSTS + '/' + values.postId;
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

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userId: props.userId
    };
  };

  render(){
    return (
      <div className = "list-users">
        <h2>Users</h2>
        <ul>
          {this.state.users.map(user => (
            user.attributes.name !== undefined &&
              <li key={user.id}>
                <Link to={`/user/${user.id}`}>
                  <h3>{user.attributes.name}</h3>
                </Link>
              </li>
          ))}
        </ul>
      </div>
    );
  }

  componentDidMount() {
    let url = APP_DOMAIN_USER_INFO;
    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          users: result.data
        });
      }
    )
  }
}
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

    fetch(APP_DOMAIN_USER_LOGIN, obj)  
    .then(function(res) {
      return res.json();
    })
    .then(function(resJson) {
      if (!!resJson.csrf_token){
        let url = APP_DOMAIN_USER_INFO + '?filter[uid][value]=' + resJson.current_user.uid;
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

    fetch(APP_DOMAIN_USER_REGISTER, obj)
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

export default App;
