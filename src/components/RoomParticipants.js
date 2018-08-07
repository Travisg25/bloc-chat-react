import React, { Component } from 'react';

class RoomParticipants extends Component {
  constructor(props) {
    super(props);
    this.state = {participants: []};
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
        <h6 key={participant.key}>{participant.username}</h6>
        <span><small>{participant.isTyping ? " is typing..." : null}</small></span>
      </div>
      )
    );
    return(
      <div>
        {roomParticipants}
      </div>
    );
  }
}

export default RoomParticipants;
