var React = require('react');

var SituationApp = React.createClass({

	render: function() {
		return (
			  <div className="col-md-12 situation">
			    <h3 className="situation_step">{this.props.step}</h3>
			    <h3 className="situation_description">{this.props.description}</h3>
			    <div id="system_time">{this.props.systemTime}</div>
			  </div>
		);
	}

});

module.exports = SituationApp;