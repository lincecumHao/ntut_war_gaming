var React = require('react');

var ChatForm = React.createClass({

	getInitialState: function() {
		return {
			text: "" 
		};
	},

	handelSubmit: function(e){
		e.preventDefault();
		var message = {
          text : this.state.text
      	}
      	this.props.onMessageSubmit(message);
		this.setState({ text: '' });
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
						<input className="form-control" type="text" placeholder="Message" onChange={this.handelMessage} value={this.state.text}/>
					</div>
					<button className="btn btn-primary" type="submit" >Send</button>
				</form>
			</div>
		);
	}

});

module.exports = ChatForm;	