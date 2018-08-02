import React, { Component } from 'react';
import * as firebase from 'firebase';
import '.././styles/user.css';


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
      <div>
        <h2>{this.props.currentUser} is signed in!</h2>
        <p> {this.props.currentUser === 'Guest' ? "Please sign in" : "You're signed in"}</p>
        <button onClick={this.signIn}>Sign In</button>
        <button onClick={this.signOut}>Sign Out</button>
       </div>
    )
  }
 }
 export default User;
