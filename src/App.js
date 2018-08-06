import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList  from './components/RoomList.js';
import MessageList from './components/MessageList.js';
import User  from './components/User.js';
import {Grid, Row, Col, Navbar}  from 'react-bootstrap';


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
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: "",
      user: null
    };
    this.setActiveRoom = this.setActiveRoom.bind(this);
    this.setUser = this.setUser.bind(this);
  }

setActiveRoom(room) {
  this.setState({ activeRoom: room });
}

setUser(user) {
  this.setState({ user: user });
}

  render() {
    let showMessages = this.state.activeRoom;
    let currentUser = this.state.user === null ? "Guest" : this.state.user.displayName;

    return (
      <Grid Fluid>
        <Row className="show-grid main-row">
          <Col xs={3}>
            <Navbar fluid>
                <h1>Bloc Chat</h1>
              <Navbar.Collapse>
                <Col xs={12}>
                  <h2>{this.state.activeRoom.name || "Choose a room or Create one"}</h2>
                </Col>
                <RoomList
                   firebase={firebase}
                   setActiveRoom={this.setActiveRoom}
                   user={this.state.user}
                 />
                 </Navbar.Collapse>
            </Navbar>
          </Col>
          <Col xs={9}>
            <User firebase={firebase} setUser={this.setUser} currentUser={currentUser}/>
        { showMessages ?
          <MessageList firebase={firebase} activeRoom={this.state.activeRoom.key} currentUser={currentUser} />
        : null
        }
        </Col>
        </Row>
      </Grid>


    );
  }
}

export default App;

// <div>
//   <User firebase={firebase} setUser={this.setUser} currentUser={currentUser}/>
//   <h1>{this.state.activeRoom.name || "Choose a room or Create one"}</h1>
//   <RoomList firebase={firebase} setActiveRoom={this.setActiveRoom} />
//   { showMessages ?
//     <MessageList firebase={firebase} activeRoom={this.state.activeRoom.key} currentUser={currentUser} />
//   : null
//   }
// </div>
