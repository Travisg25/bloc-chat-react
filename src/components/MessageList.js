import React, { Component } from 'react';
import * as firebase from 'firebase';
import '.././styles/messageList.css';
import {Col, Row, Button, FormGroup, InputGroup, FormControl}  from 'react-bootstrap';

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
  this._keyDown = this._keyDown.bind(this);
};

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat( message ) })
    });
  }

  _keyDown(e) {

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
    let participant = this.props.firebase.database().ref("rooms/" + this.props.activeRoom + "/participants");
    let messagesRef = this.props.firebase.database().ref("rooms/" + this.props.activeRoom + "/messages");

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
       roomId: ""
    })
    e.target.reset()
  };

  editMessage(message) {
    let editMessage = (
      <form onSubmit={this.updateMessage}>
        <FormGroup>
          <InputGroup>
            <FormControl type="text" defaultValue={message.content} inputRef={(input) => this.input = input}/>
            <InputGroup.Button>
              <Button type="submit">Update</Button>
              <Button onClick={() => this.setState({toEdit: ""})}>Cancel</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </form>
    )
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
    this.state.messages.map((message) => {
      if (message.roomId === activeRoom) {
        return<li key={message.key}>
            <h3>{message.username}:</h3>
            {(this.state.toEdit === message.key) && (this.props.user === message.username) ?
              this.editMessage(message)
              :
              <div>
                <h5>{" says: " + message.content}</h5>
                <button onClick={() => this.setState({toEdit: message.key})}>Edit</button>
              </div>
            }
          </li>
      }
      return null;
    })
  )

 let messageWindow= (
   <div id="messageWindow">
     <form onSubmit={this.createMessage}>
       <input type='text' placeholder="Type message here" onChange={this._addMessageContent}/>
       <input type="submit" value="Send"/>
     </form>
   </div>
  )

  // let messageWindow = (
  //   <FormGroup>
  //     <InputGroup>
  //       <FormControl
  //         type = "text"
  //         value =  {this.state.content}
  //         placeholder = "Enter a Message"
  //         onChange =  {this._addMessageContent}
  //         />
  //         <InputGroup.Button>
  //           <Button type="submit">Send</Button>
  //         </InputGroup.Button>
  //     </InputGroup>
  //   </FormGroup>
  // )

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
