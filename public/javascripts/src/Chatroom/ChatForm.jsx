var React = require('react');

var ChatForm = React.createClass({

	getInitialState: function() {
		return {
			text: "",
			chatTo: undefined
		};
	},

	componentWillMount: function() {
		if(this.props.userChatTo){
			this.setState({
				chatTo: this.props.userChatTo
			});
		}
	},

	handelSubmit: function(e){
		e.preventDefault();
		var message = {
			from : this.props.from,
          	text : this.state.text,
          	chatTo : this.props.chatTo
      	}
      	this.props.onMessageSubmit(message);
		this.setState({ text: '', chatTo: undefined });
	},

	handelMessage: function(e){
		this.setState({
			text: e.target.value 
		});
	},

	render: function() {
		return (
			<div id="sendMsgFormHolder" className="row send-message">
				<form onSubmit={this.handelSubmit}>
					<div className="input-group same-height">
						<input type="text" className="form-control" placeholder={this.props.chatTo ? "對" + this.props.chatTo + "說" : "訊息" } onChange={this.handelMessage} value={this.state.text}/>
				      	<span className="input-group-btn">
				        	<button type="submit" className="btn btn-success same-height" >送出</button>
				        </span>
					</div>
				</form>
			</div>
		);
	}

});

module.exports = ChatForm;	