import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import SignUp from './components/SignUp.jsx';
import { Router, Route, hashHistory } from 'react-router';
import Lobby from './components/Lobby.jsx';
import Home from './components/Home.jsx';
import Game from './components/Game.jsx';
import io from 'socket.io-client';

const ioSocket = io();

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false
    };

    this.sendToGame = this.sendToGame.bind(this);
    this.sendToLobby = this.sendToLobby.bind(this);
    this.sendToHomePage = this.sendToHomePage.bind(this);
    this.toggleLoggedIn = this.toggleLoggedIn.bind(this);
  }

  sendToLobby(disconnectTimeOut) {
    console.log('Sending to lobby');
    hashHistory.push('/lobby');
  }

  sendToGame(gameName, username) {
    ioSocket.emit('leave lobby', {id: ioSocket.id, username: username});
    hashHistory.push(/game/ + gameName);
  }

  sendToHomePage() {
    hashHistory.push('/');
  }

  toggleLoggedIn() {
    this.setState(prevState => ({loggedIn : !prevState.loggedIn}));
    console.log('loggedIn value now: ', this.state.loggedIn);
  }

  render() {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path="/"
            component={() => <Home toggleLoggedIn={this.toggleLoggedIn} sendToLobby={this.sendToLobby}/>}
            sendToLobby={this.sendToLobby}
            // loggedIn={this.state.isLoggedIn}
            // handleSignUp={this.handleSignUp}
            // handleLogIn={this.handleLogIn}
             />
          <Route path="/lobby"
            component={Lobby}
            ioSocket={ioSocket}
            sendToGame={this.sendToGame}
            disconnectTimeOut={this.state.disconnectTimeOut}
            sendToHomePage={this.sendToHomePage} />
          <Route path="/lobby/:disconnectTimeOut"
            component={Lobby}
            ioSocket={ioSocket}
            sendToGame={this.sendToGame}
            disconnectTimeOut={this.state.disconnectTimeOut} />
          <Route path="/game/:gamename"
            component={Game}
            ioSocket={ioSocket}
            sendToLobby={this.sendToLobby} />
        </Router>
      </div>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);

