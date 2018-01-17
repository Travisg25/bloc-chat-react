import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import RoomList  from './components/RoomList.js';
import MessageList from './components/MessageList.js';

var config = {
  apiKey: "AIzaSyCL6--NBUm0JYiTh4aXLYGSW6Wt80ParQs",
  authDomain: "bloc-chat-messenger.firebaseapp.com",
  databaseURL: "https://bloc-chat-messenger.firebaseio.com",
  projectId: "bloc-chat-messenger",
  storageBucket: "bloc-chat-messenger.appspot.com",
  messagingSenderId: "332713763369"
};
firebase.initializeApp(config);
var rootRef = firebase.database().ref();


class App extends Component {
  constructor (props){
    super(props);

    this.state = {
      activeRoom: " "
    }
    this.setActiveRoom = this.setActiveRoom.bind(this);

  }

  setActiveRoom(room) {
    this.setState({activeRoom:room})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bloc Chat</h1>
        </header>
        <div className="App-intro">
          <RoomList firebase={firebase} activeRoom={this.activeRoom} setActiveRoom={this.setActiveRoom}/>
        </div>
        <MessageList firebase={firebase} activeRoom={this.state.activeRoom} setActiveRoom={this.setActiveRoom}/>

      </div>
    );
  }
}


export default App;
