var React = require('react');
var SysMsg = require('./SysMessages.jsx');

var SystemMsgList = React.createClass({

	getInitialState: function() {
		return {
			sysMessages:[]
		};
	},

	render: function() {
		return (
			<div id="system_message">
				{
					this.props.sysMessages.map((message, i) => {
						return (
							<SysMsg
								key={i}
								text={message.text}
							/>
						);
					})
				}
			</div>
		);
	}

});

module.exports = SystemMsgList;