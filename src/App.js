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
// import 'bootstrap/dist/css/bootstrap.css';

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
    this.state = {
      activeRoom: "",
      user: null
    };
    this.setActiveRoom = this.setActiveRoom.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  setActiveRoom(room) {
    this.setState({ activeRoom: room });
    let userRef = firebase.database().ref("presence/" + this.state.user.uid);
    let roomKey = room === "" ? "" : room.key;
    userRef.update({ currentRoom: roomKey });
  }

  setUser(user) {
    this.setState({ user: user });
  }

  render() {
    let roomParticipants = (
      <RoomParticipants
        firebase={firebase}
        activeRoom={this.activeRoom}
        user={this.state.user}
      />
    );
    let showMessages = this.state.activeRoom;
    let currentUser =
      this.state.user === null ? "Guest" : this.state.user.displayName;

    return (
      <Grid fluid className="main">
        <Row className="showGrid mainRow">
          <Col xs={12} sm={3} className="sideNav">
            <Navbar fluid>
              <h1>Chatter</h1>
              <Navbar.Collapse>
                <Col xs={12} className="roomSection">
                  <h2 className="roomHeading">
                    {this.state.activeRoom.name || "Pick or Create a Room"}
                  </h2>
                </Col>
                <RoomList
                  firebase={firebase}
                  setActiveRoom={this.setActiveRoom}
                  user={this.state.user}
                />
              </Navbar.Collapse>
            </Navbar>
          </Col>
          <Col sm={9} xs={12} className="messageSection">
            <User
              firebase={firebase}
              setUser={this.setUser}
              currentUser={currentUser}
            />
            {showMessages ? (
              <MessageList
                firebase={firebase}
                activeRoom={this.state.activeRoom.key}
                currentUser={currentUser}
              />
            ) : null}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
