var React = require('react');
var Message = require("./ChatMsg.jsx");

var MessageList = React.createClass({
  render() {
      return (
          <div className="row message-list">
              <h3> 對話框: </h3>
              <div className='messages'>
                {
                    this.props.messages.map((message, i) => {
                        return (
                            <Message
                                key={i}
                                text={message.text}
                                userChatTo={message.chatTo}
                                userFrom={message.from}
                            />
                        );
                    })
                }
              </div>
          </div>
      );
  }
});

module.exports = MessageList;  