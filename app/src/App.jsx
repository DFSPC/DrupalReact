import React from 'react';
import Menu from './menu/menu.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    const savedUser = localStorage.getItem('drupalUser');
    const user = savedUser ? JSON.parse(savedUser) : null;
    this.state = {
      user: user && user.csrfToken && user.logoutToken ? user : {
        uid: null,
        name: null,
        token: null
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
          <Menu user = {this.state.user}/>
        </div>
      </div>
    )
  };
}

export default App;
