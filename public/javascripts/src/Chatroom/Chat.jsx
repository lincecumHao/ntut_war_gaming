var React = require('react');
var MessageList = require("./ChatMsgLst.jsx");
var MessageForm = require("./ChatForm.jsx");
var UserList = require("./UserList.jsx");
var $ =require("jquery");

var ChatApp = React.createClass({

  getInitialState: function() {
      return {
        users: [
          "all"
        ], 
        messages:[], 
        text: '', 
        chatTo: undefined};
  },

  componentDidMount: function() {
    this.props.socket.on("currentUsers", this._getCurrentUsers)
    this.props.socket.on('send:message', this._messageRecieve);
    this.props.socket.on('user:join', this._userJoined);
    this.props.socket.on('user:left', this._userLeft);
  },

  _getCurrentUsers: function(data){
    if(data){
        this.setState({
        users: this.state.users.concat(data) 
      });
    }
  },

  _messageRecieve: function(messageObj) {
      var stateMsgs = this.state.messages;
      stateMsgs.push({
        from: messageObj.from,
        text: messageObj.text,
        chatTo: messageObj.chatTo
      });
      this.setState({messages: stateMsgs});
  },

  _userJoined: function(username) {
      var currentUsers = this.state.users;
      if(currentUsers.indexOf(username) > -1) {
        return;
      }
      var currentMessages = this.state.messages;
      currentUsers.push(username);
      currentMessages.push({
        from : "系統",
        text : username +' 已加入'
      });
      this.setState({users: currentUsers, messages: currentMessages});
  },

  _userLeft: function(username) {
      var currentUsers = this.state.users;
      var currentMessages = this.state.messages;
      var index = currentUsers.indexOf(username);
      currentUsers.splice(index, 1);
      currentMessages.push({
        from : "系統",
        text : username +' 已離開'
      });
      this.setState({users: currentUsers, messages: currentMessages});
  },

  onChatTo: function(username){
    this.setState({
      chatTo: (username == "all" ? undefined : username) 
    });
  },

  handleMessageSubmit: function(message) {
      this.props.socket.emit('send:message', message);
  },

  render: function() {
      return (
          <div>
              <UserList 
                users={this.state.users}
                onChatTo={this.onChatTo}
               />
              <MessageList
                  messages={this.state.messages}
              />
              <MessageForm
                  onMessageSubmit={this.handleMessageSubmit}
                  chatTo={this.state.chatTo}
                  from={this.props.self.name}
              />
          </div>
      );
  }
});

module.exports = ChatApp; 