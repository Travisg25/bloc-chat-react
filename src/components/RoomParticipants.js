import React, { Component } from 'react';
import '.././styles/roomParticipants.css';
import { Button } from 'react-bootstrap';


class RoomParticipants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
      isOpen: true};
    this.toggleList = this.toggleList.bind(this);
  }
   toggleList() {
    this.setState( prevState => ({
      isOpen: !prevState.isOpen
    }));
}

   componentDidMount() {
    let roomRef = this.props.firebase.database().ref("rooms/" + this.props.activeRoom + "/participants");
    roomRef.on('value', snapshot => {
      let participantChanges = [];
      snapshot.forEach((participant) => {
          participantChanges.push({
            key: participant.key,
            username: participant.val().username,
            isTyping: participant.val().isTyping
          });
      });
      this.setState({
        participants: participantChanges});
    });
  }

   componentWillReceiveProps(nextProps) {
    if (nextProps.activeRoom !== this.props.activeRoom) {
      const roomRef = this.props.firebase.database().ref("rooms/" + nextProps.activeRoom + "/participants");
      roomRef.on('value', snapshot => {
        const participantChanges = [];
        snapshot.forEach((participant) => {
            participantChanges.push({
              key: participant.key,
              username: participant.val().username,
              isTyping: participant.val().isTyping
            });
        });
        this.setState({
          participants: participantChanges});
      });
    }
  }

   render() {
    let roomParticipants = (
      this.state.participants.map((participant) =>
      <div key={participant.key}>
        <h6 key={participant.key}>{participant.username}
        <span><small>{participant.isTyping ? " is typing..." : null}</small></span>
        </h6>
      </div>
      )
    );
    return(
      <div>
        <p>Room Paricipants</p>
        <Button bsSize="small" onClick={this.toggleList}>{this.state.isOpen ? "Hide" : "Show"}</Button>
        {this.state.isOpen ? roomParticipants : null }
      </div>
    );
  }
}

export default RoomParticipants;
