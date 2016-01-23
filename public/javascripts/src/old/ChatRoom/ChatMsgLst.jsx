var React = require('react');
var Message = require("./ChatMsg.jsx");

var MessageList = React.createClass({
  render() {
      return (
          <div>
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
                                selfname={this.props.selfname}
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