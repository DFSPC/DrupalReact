import React from 'react';
import { Link } from "react-router-dom";
import Constants from './../constants/constants.js';

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
            user.attributes.display_name !== undefined &&
              <li key={user.id}>
                <Link to={
                  {
                    pathname: `/user/${user.id}`,
                    userName: user.attributes.display_name
                    }
                }>
                  <h3>{user.attributes.display_name}</h3>
                </Link>
              </li>
          ))}
        </ul>
      </div>
    );
  }

  componentDidMount() {
    let url = Constants.APP_DOMAIN_USER_INFO;
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

export default Users;