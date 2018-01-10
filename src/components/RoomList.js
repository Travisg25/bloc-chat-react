import React, { Component } from 'react';
import * as firebase from 'firebase';

class RoomList extends Component {
  constructor (props){
  super(props);

  this.state = {
  rooms: []
  };
  this.roomsRef = this.props.firebase.database().ref('rooms');

}

componentDidMount() {
  this.roomsRef.on('child_added', snapshot => {
    const room = snapshot.val();
    room.key = snapshot.key;
    this.setState({ rooms: this.state.rooms.concat( room ) })
  });
}

  render() {
    let roomlist = this.state.rooms.map((room) =>
  <li>{room.name}</li>
);
    return (
      <div>
        <ul>{roomlist}</ul>
      </div>
    );
  }
}


 export default RoomList;
