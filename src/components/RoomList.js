import React, { Component } from 'react';
import * as firebase from 'firebase';


class RoomList extends Component {
  constructor (props){
  super(props);
  this.state = {
    rooms: [],
    name:'',
    toEdit: ''
  };
  this.roomsRef = this.props.firebase.database().ref('rooms');
  this.createRoom = this.createRoom.bind(this);
  this._roomChange = this._roomChange.bind(this);
  this.editRoom = this.editRoom.bind(this);
  this.updateRoom = this.updateRoom.bind(this);
}

componentDidMount() {
  this.roomsRef.on('value', snapshot => {
    let roomChanges = [];
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

deleteRoom(roomKey) {
  let room = this.props.firebase.database().ref("rooms/" + roomKey);
  room.remove();
}

editRoom(room) {
  let editRoom = (
    <form onSubmit={this.updateRoom}>
      <input type="text" defaultValue={room.title} ref={(input) => this.input = input}/>
      <input type="submit" value="Update" />
      <button type="button" onClick={() => this.setState({toEdit: ""})}>Cancel</button>
    </form>
  );
  return editRoom;
}
 updateRoom(e) {
  e.preventDefault();
  const updates = {[this.state.toEdit + "/name"]: this.input.value};
  this.roomsRef.update(updates);
  this.setState({ toEdit: ""});
}

  render() {
    let roomlist = this.state.rooms.map((room, index) =>
    <li key={room.key}>
      {this.state.toEdit === room.key ?
        this.editRoom(room)
      :
      <div>
        <h3 onClick={(e) => this.selectRoom(room, e)}>{room.name}</h3>
        <button onClick={() => this.deleteRoom(room.key)}>Remove</button>
        <button onClick={() => this.setState({toEdit: room.key})}>Edit</button>
      </div>
      }
      </li>
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
