var React = require('react');
var LoginForm = React.createClass({

	getInitialState: function() {
		return {
			failedMsg: "",
			username: "",
			password: "" 
		};
	},

	handelSubmit: function(e){
		e.preventDefault();
		$.post("./login", this.state, function(data){
			if(data.status == 0){
				this.setState({
					failedMsg: "Login Failed..." 
				});
			}else{
				window.location = "localhost:3000/";
        		location.reload();
			}
		}.bind(this));
	},

	handelUserNameChang: function(e){
		this.setState({
			username: e.target.value 
		});
	},

	handelPasswordChang: function(e){
		this.setState({
			password: e.target.value 
		});
	},

	render: function() {
		return (
			<form className="form-signin" onSubmit={this.handelSubmit} >
				<input className="form-control" type="text" value={this.state.username} placeholder="Account" onChange={this.handelUserNameChang} required autofocus/>
				<input className="form-control" type="password" value={this.state.password} placeholder="Password" onChange={this.handelPasswordChang} required/>
				<div><p>{this.state.failedMsg}</p></div>
				<button className="btn btn-lg btn-primary btn-block btn-signin" type="submit" >Login</button>
			</form>
		);
	}

});

module.exports = LoginForm;	