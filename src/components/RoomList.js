import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Col, Navbar, MenuItem, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';
import '.././styles/roomList.css';


class RoomList extends Component {
  constructor (props){
  super(props);
  this.state = {
    rooms: [],
    creator: "",
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
          creator: room.val().creator,
          name: room.val().name,
        });
      });
      this.setState({ rooms: roomChanges})
    });
  }

  _roomChange (e) {
    e.preventDefault();
    this.setState({
      name: e.target.value,
      creator: e.target.value
    });
  }

  createRoom (e) {
    e.preventDefault()
    this.roomsRef.push(
      {
        name: this.state.name,
        creator: this.state.creator
      }
    );
    this.setState({ name: "", creator: "" })
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
      <div className="roomEdit">
        <form onSubmit={this.updateRoom}>
          <FormGroup>
            <InputGroup>
              <FormControl type="text" defaultValue={room.name} inputRef={(input) => this.input = input} />
              <InputGroup.Button>
                <Button type="submit" alt="update">
                submit
                </Button>
                <Button type="button" alt="cancel" onClick={() => this.setState({toEdit: ""})}>
                edit

                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </form>
      </div>
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
            <MenuItem onClick={() => this.setState({toEdit: room.key})}>Edit</MenuItem>
            <MenuItem onClick={() => this.deleteRoom(room.key)}>Delete</MenuItem>
        </div>
      }
      </li>
    );

    let roomForm = (
      <form onSubmit={this.createRoom}>
        <FormGroup>
          <InputGroup>
            <FormControl type="text" name="title" value={this.state.name} placeholder="New Room" onChange={this._roomChange}/>
            <InputGroup.Button>
              <Button type="submit">Create</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </form>
      )

    return (
      <Col xs={12} className="roomList">
        <ul>{roomForm}</ul>
        <ul>{roomlist}</ul>
      </Col>
    );
  }
}


export default RoomList;
