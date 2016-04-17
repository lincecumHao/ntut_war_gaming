var React = require('react');

var ChatMsg = React.createClass({
  render() {
  		var msg;
  		var msgClass = 'message';
  		if(this.props.userFrom == 'system'){
  			msgClass = 'sysMessage';
  			msg = this.props.text;
  		}else{
  			msg = this.props.userFrom + (this.props.userChatTo ? ' 對 ' + this.props.userChatTo : '') + '說: ' + this.props.text;
  		}
      return (
          <div className={msgClass}>
          	<p>
          		{msg}
          	</p>
          </div>
      );
  }
});

module.exports = ChatMsg;  