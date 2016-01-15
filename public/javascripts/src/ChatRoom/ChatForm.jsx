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
			<div id="sendMsgFormHolder">
				<form className="form-inline" role='form' onSubmit={this.handelSubmit} >
					<div className="form-group">
						<input className="form-control" style={{width:"70%"}} type="text" placeholder={this.props.chatTo ? "對" + this.props.chatTo + "說" : "訊息" } onChange={this.handelMessage} value={this.state.text}/>
						<button className="btn btn-primary" style={{width:"30%"}} type="submit" >Send</button>
					</div>
				</form>
			</div>
		);
	}

});

module.exports = ChatForm;	