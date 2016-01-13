var React = require('react');
var Message = require("./ChatMsg.jsx");

var MessageList = React.createClass({
  render() {
      return (
          <div className='messages'>
              <h2> Conversation: </h2>
              {
                  this.props.messages.map((message, i) => {
                      return (
                          <Message
                              key={i}
                              text={message}
                          />
                      );
                  })
              }
          </div>
      );
  }
});

module.exports = MessageList;  