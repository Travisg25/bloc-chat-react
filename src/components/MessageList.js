import React, { Component } from 'react';
import * as firebase from 'firebase';
import '.././styles/messageList.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Moment from 'react-moment';
import {Col, Row, FormGroup, InputGroup, FormControl, Button}  from 'react-bootstrap';

class MessageList extends Component {
  constructor (props){
  super(props);
    this.state = {
      username: "",
      content: "",
      sentAt: "",
      roomId: "",
      messages: [],
      toEdit: ''
    };
  this.messagesRef = this.props.firebase.database().ref('messages');
  this.createMessage = this.createMessage.bind(this);
  this._addMessageContent = this._addMessageContent.bind(this);
  this.editMessage =  this.editMessage.bind(this);
  this.updateMessage = this.updateMessage.bind(this);
};

componentDidMount() {
  this.messagesRef.on('child_added', snapshot => {
    const message = snapshot.val();
    message.key = snapshot.key;
    this.setState({ messages: this.state.messages.concat( message ) })
  });
}

_addMessageContent (e) {
  e.preventDefault();
  this.setState(
    {
    content: e.target.value,
    sentAt: firebase.database.ServerValue.TIMESTAMP,
    roomId: this.props.activeRoom,
    username: this.props.currentUser
  })
}

createMessage(e) {
  e.preventDefault();
  this.messagesRef.push(
    {
      content: this.state.content,
      sentAt: this.state.sentAt,
      roomId: this.state.roomId,
      username: this.props.currentUser

    }
  );
   this.setState ({
     message: "",
     sentAt: "",
     roomId: "",
  })
  e.target.reset()
 };

 editMessage(message) {
   let editMessage= (
     <form onSubmit={this.updateMessage}>
       <input type="text" defaultValue={message.content} ref={(input) => this.input = input}/>
       <input type="submit" value="Update" />
       <button type="button" onClick={() => this.setState({toEdit: ""})}>Cancel</button>
     </form>
   );
   return editMessage;
 }
  updateMessage(e) {
   e.preventDefault();
   let messagesRef = this.props.firebase.database().ref("rooms/" + this.props.activeRoom + "/messages");
   let updates = {[this.state.toEdit + "/content"]: this.input.value};
   messagesRef.update(updates);
   this.setState({ toEdit: ""});
 }

 render() {
   let activeRoom = this.props.activeRoom
   let currentMessages = (
     this.state.messages.map((message)=> {
       if (message.roomId === activeRoom) {
         return<ol key={message.key}>
         <h3>{message.username + " -says: "}</h3>
         {" " + message.content}
           <button onClick={() => this.setState({toEdit: message.key})}>Edit</button>
         </ol>
       }
       return null;
     })
   );

   let messageWindow= (

  <form onSubmit={this.createMessage}>
    <input type="text" value={this.state.content} placeholder="Enter Message" onChange={this._addMessageContent}/>
    <input type="submit" value="Send" />
  </form>
   )
   return (
     <Row className="showGrid messageListBar">
       <Col xs={12} className="messageListBar">
          <Row className="showGrid">
           <Col xs={12} className="messageList">
             <ul>{currentMessages}</ul>
           </Col>
         </Row>
          <Row className="showGrid">
           <Col xs={12} id="messageWindow">{messageWindow}</Col>
         </Row>
        </Col>
     </Row>
   );
 }
}


export default MessageList;
