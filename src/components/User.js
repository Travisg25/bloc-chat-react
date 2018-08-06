import React, { Component } from 'react';
import * as firebase from 'firebase';
import '.././styles/user.css';
import {Col, Row, FormGroup, InputGroup, FormControl, Button}  from 'react-bootstrap';



class User extends Component {
  constructor (props){
    super(props);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }
 componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged((user) => {
      this.props.setUser(user);
    });
  }
 signIn() {
  const provider = new this.props.firebase.auth.GoogleAuthProvider();
  this.props.firebase.auth().signInWithPopup(provider).then((result) => {
    const user = result.user;
    this.props.setUser(user);
  });
}
 signOut() {
  this.props.firebase.auth().signOut().then(() => {
    this.props.setUser(null);
  });
}
  render() {
     return (
       <Row className="showGrid">
        <Col xs={12} className="loginSection">
          <h3>Welcome, {this.props.currentUser}</h3>
          { this.props.currentUser === "Guest" ?
            <button onClick={this.signIn}>Sign In</button>
            :
            <button onClick={this.signOut}>Sign Out</button>
          }
        </Col>
      </Row>
    )
  }
 }
 export default User;
