import React, { Component } from 'react';
import * as firebase from 'firebase';
import '.././styles/user.css';
import {Col, Row, Button}  from 'react-bootstrap';

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
       <Row className="loginSection">
        <Col xs={12} className="loginSection">
          <h5>Welcome, {this.props.currentUser}</h5>
          { this.props.currentUser === "Guest" ?
            <h6 onClick={this.signIn}>Sign In</h6>
            :
            <h6 onClick={this.signOut}>Sign Out</h6>
          }
        </Col>
      </Row>
    )
  }
 }
 export default User;
