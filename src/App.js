import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    let name = 'Max'
    let color = 'lightblue'
    let headerStyle = { color: color, 'font-size': '50px'}
    return (
      <div className="App">
        <h1>Title</h1>

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 style={headerStyle} className="App-title">Welcome {name}! JS will be the last programming language you will use, whether you want to or not >:)</h1>}
        </header>
      </div>
    );
  }
}

export default App;
