import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const API = 'http://localhost:8080/';
const DEFAULT_QUERY = '';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: "waiting for response",
    };
  }

  componentDidMount() {
    fetch(API + DEFAULT_QUERY)
      .then(response => {
        return response.text();
      })
      .then(data => {
        this.setState({ msg: data });
      });
  }

  render() {
    const { msg } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to ASSO ma nigga.</h1>
        </header>
        <p className="App-intro">
          To get into THE FLOW, edit <code>src/App.js</code> and save your soul from LGP.
        </p>

        <div>
          {msg}
        </div>

      </div>
    );
  }
}

export default App;
