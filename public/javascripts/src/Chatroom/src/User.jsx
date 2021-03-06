var React = require('react');

var User = React.createClass({

	_handleChatTo: function(e){
		e.preventDefault();
		this.props.onChatTo(this.props.user);
	},

  	render: function(){
  		return (
        	<button type="button" className="btn btn-primary btn-xs" onClick={this._handleChatTo}>{this.props.user}</button>
      	);
  	}
});

module.exports = User;  