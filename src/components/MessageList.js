import React, { Component } from 'react';
import * as firebase from 'firebase';

class MessageList extends Component {
  constructor (props){
  super(props);
  this.state = {
    username: "",
    content: "",
    sentAt: "",
    roomId: "",
    messages: []
  };
  this.messagesRef = this.props.firebase.database().ref('messages');
  this.createMessage = this.createMessage.bind(this);
  this._addMessageContent = this._addMessageContent.bind(this);

};

componentDidMount() {
  this.messagesRef.orderByChild('roomId').on('child_added', snapshot => {
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
    roomId: this.props.activeRoom
  })
}


createMessage(e) {
  e.preventDefault();
  this.messagesRef.push(
    {
      content: this.state.content,
      sentAt: this.state.sentAt,
      // roomId: this.state.roomId
    }
  );
   this.setState ({
   message: "",
   sentAt: "",
   roomId: "",
  })
  e.target.reset()
 };

 render() {
   let currentMessage = this.state.messages.map((message, index) => {
     return (
       <li key={message.key}>{message.content}</li>
     )
   })
   return (
     <div>
       <ol>
         {currentMessage}
       </ol>
       <form onSubmit={this.createMessage}>
         Message Form:
         <textarea type='text' placeholder="Type message here" onChange={this._addMessageContent}/>
         <input type="submit" value="Submit"/>
       </form>
     </div>
   );
 }
}


export default MessageList;
