var React = require('react');

var ChatMsg = React.createClass({
  render() {
      return (
          <div>
          	<p>
          		<mark>{this.props.userFrom}</mark> {this.props.userChatTo ? ' 對 ' + this.props.userChatTo : ''} 說:{this.props.text}
          	</p>
          </div>
      );
  }
});

module.exports = ChatMsg;  