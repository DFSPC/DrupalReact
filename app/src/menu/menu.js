import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Login from './../users/login.js';
import Register from './../users/register.js';
import Users from './../users/users.js';
import AllPosts from './../posts/all_posts.js';
import CreatePost from './../posts/create_post.js';
import MyPosts from './../posts/my_posts.js';
import UserPosts from './../posts/user_posts.js';
import DetailPost from './../posts/detail_post.js';
import DeletePost from './../posts/delete_post.js';
import EditPost from './../posts/edit_post.js';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
          <Routes>
            <Route path="/login"
              element={<Login 
                user = {this.state.user}
                updateUser = {this.updateUser}
              />}
            />
            <Route path="/register"
               element={<Register
                user = {this.state.user}
                updateUser = {this.updateUser}
              />}
            />
            <Route path="/posts"
               element={<AllPosts />}
            />
            <Route path="/users"
              element={<Users />}
            />
            <Route path="/create"
              element={<CreatePost user = {this.state.user}/>}
            />
            <Route path={"/posts-me"}
              element={<MyPosts user = {this.state.user}/>}
            />
            <Route
              exact path="/user/:userId"
              render={(props) => <UserPosts {...props}/>}
            />
            <Route
              exact path="/post/:postId"
              children={(props) => <DetailPost {...props} user = {this.state.user}/>}
            />
            <Route
              exact path="/post-delete/:postId"
              render={(props) => <DeletePost {...props} user = {this.state.user}/>}
            />
            <Route
              exact path="/post-edit/:postId"
              render={(props) => <EditPost {...props} user = {this.state.user}/>}
            />
          </Routes>
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

export default Menu;