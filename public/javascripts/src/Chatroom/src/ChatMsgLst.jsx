var React = require('react');
var ReactDOM = require("react-dom");
var Message = require("./ChatMsg.jsx");

var MessageList = React.createClass({
  getInitialState: function() {
    return {
      containerInlineStyle: {height: '0px'},
      messageListInlineStyle: {height: '0px'}
    }
  },

  componentWillReceiveProps: function(nextProp) {
    var containerInlineStyle = {};
    var messageListInlineStyle = {};
    containerInlineStyle['height'] = parseInt(nextProp.windowHeight * 0.7 - 35);
    messageListInlineStyle['height'] = parseInt(containerInlineStyle.height - 40);
    this.setState({
      containerInlineStyle: {containerInlineStyle},
      messageListInlineStyle: messageListInlineStyle
    });
  },

  componentWillUpdate: function() {
    var node = ReactDOM.findDOMNode(this.refs.msgList);
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  },
   
  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      this._msgListcrollTop();
    }
  },

  _msgListcrollTop: function(){
    var node = ReactDOM.findDOMNode(this.refs.msgList) ;
    node.scrollTop = node.scrollHeight;
  },

  render() {
      return (
          <div className="row message-container" style={this.state.containerInlineStyle}>
              <div className="chatroom-subject">
                <h3> 對話框: </h3>
              </div>
              <div ref='msgList' className='message-list' style={this.state.messageListInlineStyle}>
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