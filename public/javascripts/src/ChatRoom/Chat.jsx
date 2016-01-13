var React = require('react');
var MessageList = require("./ChatMsgLst.jsx");
var MessageForm = require("./ChatForm.jsx");
var socket = io();

var ChatApp = React.createClass({

  getInitialState() {
      return {messages:[], text: ''};
  },

  componentDidMount() {
      socket.on('send:message', this._messageRecieve);
  },

  _messageRecieve(message) {
      var stateMsgs = this.state.messages;
      stateMsgs.push(message);
      this.setState({messages: stateMsgs});
  },

  handleMessageSubmit(message) {
      socket.emit('send:message', message.text);
  },

  render() {
      return (
          <div>
              <MessageList
                  messages={this.state.messages}
              />
              <MessageForm
                  onMessageSubmit={this.handleMessageSubmit}
              />
          </div>
      );
  }
});

module.exports = ChatApp; 