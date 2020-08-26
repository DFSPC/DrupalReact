import React from 'react';
import Menu from './menu/menu.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
          <Menu user = {this.state.user}/>
        </div>
      </div>
    )
  };
}

export default App;
