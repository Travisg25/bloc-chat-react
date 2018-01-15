import React, { Component } from 'react';
import * as firebase from 'firebase';

class RoomList extends Component {
  constructor (props){
  super(props);

  this.state = {
  rooms: [],
  name:''
  };
  this.roomsRef = this.props.firebase.database().ref('rooms');
  this.createRoom = this.createRoom.bind(this);
  this._roomNameChange = this._roomNameChange.bind(this);
}

componentDidMount() {
  this.roomsRef.on('child_added', snapshot => {
    const room = snapshot.val();
    room.key = snapshot.key;
    this.setState({ rooms: this.state.rooms.concat( room ) })
  });
}

_roomNameChange (e) {
  this.setState({name: e.target.value})
}


createRoom (e) {
  e.preventDefault()
  this.roomsRef.push(
    {name: this.state.name}
  );
  this.setState({ name: "" })
  e.target.reset()
}

  render() {
    let roomlist = this.state.rooms.map((room, index) =>
      <li key={index}>{room.name}</li>
    );

    return (
      <div>
        <ul>{roomlist}</ul>
        <form onSubmit={this.createRoom}>
          Add a Room:
          <input type="text" placeholder="Chatroom Name" onChange={this._roomNameChange} />
          <input type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}


 export default RoomList;
