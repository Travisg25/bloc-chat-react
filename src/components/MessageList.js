import React, { Component } from 'react';
import * as firebase from 'firebase';

class MessageList extends Component {
  constructor (props){
  super(props);

  this.state = {
    // username: "<USERNAME HERE>",
    content: "",
    // sentAt: "<TIME MESSAGE WAS SENT HERE>",
    // roomId: "<ROOM UID HERE>",
    messages: []
  };
  this.messagesRef = this.props.firebase.database().ref('messages');
  this.createMessage = this.createMessage.bind(this);
  this._addMessageContent = this._addMessageContent.bind(this);

};

componentDidMount() {
  this.messagesRef.on('child_added', snapshot => {
    const message = snapshot.val();
    message.key = snapshot.key;
    this.setState({ messages: this.state.messages.concat( message ) })
  });
}

_addMessageContent (e) {
  this.setState({content: e.target.value})
}

createMessage(e) {
  e.preventDefault();
  this.messagesRef.push(
    {content: this.state.content}
  );
   this.setState ({message: "",
   sentAt: "",
   roomId: ""})
 };

  render() {
    let currentMessage = this.state.messages.map((message, index) => {
      return (
        <li key={index}>{message.content}</li>
      )
    })

    return (
      <div>
        <ol>
          {currentMessage}
        </ol>
        <form onSubmit={this.createMessage}>
          Message Form:
          <input type='text' placeholder="Type message here" onChange={this._addMessageContent}/>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}


export default MessageList;
