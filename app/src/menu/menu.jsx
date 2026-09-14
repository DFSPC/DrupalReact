import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useLocation
} from "react-router-dom";

import Login from './../users/login.jsx';
import Register from './../users/register.jsx';
import Users from './../users/users.jsx';
import AllPosts from './../posts/all_posts.jsx';
import CreatePost from './../posts/create_post.jsx';
import MyPosts from './../posts/my_posts.jsx';
import UserPosts from './../posts/user_posts.jsx';
import DetailPost from './../posts/detail_post.jsx';
import DeletePost from './../posts/delete_post.jsx';
import EditPost from './../posts/edit_post.jsx';

function DetailPostRoute(props) {
  const params = useParams();
  return <DetailPost {...props} match={{ params }} />;
}

function UserPostsRoute() {
  const params = useParams();
  const location = useLocation();
  return <UserPosts match={{ params }} location={location} />;
}

function EditPostRoute(props) {
  const params = useParams();
  return <EditPost {...props} match={{ params }} />;
}

function DeletePostRoute(props) {
  const params = useParams();
  const location = useLocation();
  return <DeletePost {...props} match={{ params }} location={location} />;
}

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
              path="/user/:userId"
              element={<UserPostsRoute />}
            />
            <Route
              path="/post/:postId"
              element={<DetailPostRoute user = {this.state.user}/>}
            />
            <Route
              path="/post-delete/:postId"
              element={<DeletePostRoute user = {this.state.user}/>}
            />
            <Route
              path="/post-edit/:postId"
              element={<EditPostRoute user = {this.state.user}/>}
            />
          </Routes>
        </div>
      </Router>
    )
  };

  updateUser = (user) => {
    if (user.token) {
      localStorage.setItem('drupalUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('drupalUser');
    }
    this.setState({
      user: user
    })
  }
}

export default Menu;