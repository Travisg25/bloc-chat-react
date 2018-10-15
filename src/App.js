import React, { Component } from "react";
import "./App.css";
import * as firebase from "firebase";
import RoomList from "./components/RoomList.js";
import MessageList from "./components/MessageList.js";
import RoomParticipants from "./components/RoomParticipants.js";
import User from "./components/User.js";
import {
  Grid,
  Row,
  Col,
  Navbar,
  MenuItem,
  FormGroup,
  InputGroup,
  FormControl,
  Button
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { FindUser } from "./components/FindUser.js";

let config = {
  apiKey: "AIzaSyCL6--NBUm0JYiTh4aXLYGSW6Wt80ParQs",
  authDomain: "bloc-chat-messenger.firebaseapp.com",
  databaseURL: "https://bloc-chat-messenger.firebaseio.com",
  projectId: "bloc-chat-messenger",
  storageBucket: "bloc-chat-messenger.appspot.com",
  messagingSenderId: "332713763369"
};
firebase.initializeApp(config);
let rootRef = firebase.database().ref();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { activeRoom: "", user: null };
    this.activeRoom = this.activeRoom.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  activeRoom(room) {
    this.setState({ activeRoom: room });
    const userRef = firebase.database().ref("presence/" + this.state.user.uid);
    const roomKey = room === "" ? "" : room.key;
    const roomTitle = room === "" ? "" : room.title;
    userRef.update({ currentRoom: roomKey, roomName: roomTitle });
  }

  setUser(user) {
    this.setState({ user: user });
  }

  render() {
    let messageList, currentUser, roomList, roomParticipants, findUser;

    if (this.state.user !== null) {
      roomList = (
        <RoomList
          firebase={firebase}
          activeRoom={this.activeRoom}
          user={this.state.user.email}
        />
      );
      currentUser = this.state.user.displayName;
      findUser = <FindUser firebase={firebase} />;
    } else {
      currentUser = "Guest";
    }

    if (this.state.user !== null && this.state.activeRoom) {
      messageList = (
        <MessageList
          firebase={firebase}
          activeRoom={this.state.activeRoom.key}
          user={this.state.user}
        />
      );
      roomParticipants = (
        <RoomParticipants
          firebase={firebase}
          activeRoom={this.state.activeRoom.key}
        />
      );
    }

    return (
      <Grid fluid className="main">
        <Row className="show-grid main-row">
          <Col sm={4} xs={12} className="sidenav">
            <h1 className="app-header">Chatter</h1>
            <User
              firebase={firebase}
              setUser={this.setUser}
              welcome={currentUser}
            />
            <Col xs={12} className="room-section">
              {roomParticipants}
            </Col>
            <h2 className="active-room">
              {this.state.activeRoom.title || "Select a Room"}
            </h2>
            {roomList}
          </Col>

          {messageList}
        </Row>
      </Grid>
    );
  }
}

export default App;
