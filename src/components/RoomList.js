import React, { Component } from "react";
import {
  Col,
  Navbar,
  DropdownButton,
  MenuItem,
  FormGroup,
  InputGroup,
  FormControl,
  Button,
  ButtonGroup
} from "react-bootstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ".././styles/roomList.css";

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      creator: "",
      rooms: [],
      toEdit: "",
      isOpen: false
    };
    this.roomsRef = this.props.firebase.database().ref("rooms");
    this.handleChange = this.handleChange.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
    this.editRoom = this.editRoom.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
    this.validateRoomName = this.validateRoomName.bind(this);
    this.updatedeleteMessage = this.updateRoom.bind(this);
    this.toggleCreateRoom = this.toggleCreateRoom.bind(this);
  }

  validateRoomName(str) {
    const roomTitle = str || this.state.title;
    const roomLength = roomTitle.trim().length;
    if (roomLength > 0) {
      return true;
    } else {
      return false;
    }
  }

  toggleCreateRoom() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
      creator: this.props.user
    });
  }

  createRoom(e) {
    e.preventDefault();
    if (this.validateRoomName()) {
      this.roomsRef.push({
        title: this.state.title,
        creator: this.state.creator
      });
      this.setState({ title: "", creator: "", isOpen: false });
    }
  }

  deleteRoom(roomKey) {
    const room = this.props.firebase.database().ref("rooms/" + roomKey);
    const roomMessages = this.props.firebase
      .database()
      .ref("messages/" + roomKey);
    room.remove();
    roomMessages.remove();
    this.props.activeRoom("");
  }

  editRoom(room) {
    const editRoom = (
      <div className="room-edit">
        <form onSubmit={this.updateRoom}>
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                defaultValue={room.title}
                inputRef={input => (this.input = input)}
              />
              <InputGroup.Button>
                <Button type="submit" alt="update">
                  <i className="fa fa-check" />
                </Button>
                <Button
                  type="button"
                  alt="cancel"
                  onClick={() => this.setState({ toEdit: "" })}
                >
                  <i className="fa fa-times" />
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
    const updates = { [this.state.toEdit + "/title"]: this.input.value };
    this.roomsRef.update(updates);
    this.setState({ toEdit: "" });
  }

  componentDidMount() {
    this.roomsRef.on("value", snapshot => {
      const roomChanges = [];
      snapshot.forEach(room => {
        roomChanges.push({
          key: room.key,
          title: room.val().title,
          creator: room.val().creator
        });
      });
      this.setState({ rooms: roomChanges });
    });
  }

  selectRoom(room) {
    this.props.activeRoom(room);
  }

  render() {
    const roomForm = (
      <form onSubmit={this.createRoom}>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              name="title"
              value={this.state.title}
              placeholder="New Room"
              onChange={this.handleChange}
            />
            <InputGroup.Button>
              <Button type="submit">Create</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </form>
    );

    const roomList = this.state.rooms.map(room => (
      <CSSTransition
        key={room.key}
        classNames="room-transition"
        timeout={{ enter: 500, exit: 300 }}
      >
        <li className="room-list-item">
          {this.state.toEdit === room.key ? (
            this.editRoom(room)
          ) : (
            <div className="room-block">
              {this.props.user === room.creator ? (
                <div className="room-list-container">
                  <span
                    className="room-list-item fa fa-wrench text-warning"
                    onClick={() => this.setState({ toEdit: room.key })}
                  />
                  <span
                    className="room-list-item fa fa-trash text-danger"
                    onClick={() => this.deleteRoom(room.key)}
                  />
                </div>
              ) : (
                <div className="no-options" />
              )}
              <h3
                className="room-title cursor-color-change"
                onClick={e => this.selectRoom(room, e)}
              >
                {room.title}
              </h3>
            </div>
          )}
        </li>
      </CSSTransition>
    ));

    return (
      <Col xs={12} className="room-list">
        <div>
          <h3 id="create-room" onClick={this.toggleCreateRoom}>
            create a room
          </h3>
        </div>
        {this.state.isOpen ? (
          <div className="room-form">
            <div>{roomForm}</div>
          </div>
        ) : null}
        <TransitionGroup component="ul">{roomList}</TransitionGroup>
      </Col>
    );
  }
}

export default RoomList;
