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
  this._roomChange = this._roomChange.bind(this);
}

componentDidMount() {
  this.roomsRef.on('value', snapshot => {
    const roomChanges = [];
    snapshot.forEach((room) => {
      roomChanges.push({
        key: room.key,
        name: room.val().name
      });
    });
    this.setState({ rooms: roomChanges})
  });
}

_roomChange (e) {
  e.preventDefault();
  this.setState({name: e.target.value})
}

createRoom (e) {
  e.preventDefault()
  this.roomsRef.push(
    {
      name: this.state.name,
    }
  );
  this.setState({ name: "" })
}

selectRoom(room) {
  this.props.setActiveRoom(room);
}

  render() {
    let roomlist = this.state.rooms.map((room, index) =>
      <li key={room.key} onClick={ (e) => {this.selectRoom(room,e)} }>{room.name}</li>
    );
    let roomForm = (

        <form onSubmit={this.createRoom}>
          <h2>Add a room:</h2>
          <input type="text" value={this.state.name} placeholder="Type room name" onChange={this._roomChange} />
          <input type="submit" value="Submit"/>
        </form>

      )
    return (
      <div>
        <ul>{roomlist}</ul>
        <ul>{roomForm}</ul>
      </div>
    );
  }
}


 export default RoomList;
