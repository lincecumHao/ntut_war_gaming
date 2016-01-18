var React = require('react');

var ResourceItem = React.createClass({
  render: function() {
  	return (
  		<div className="input-group">
  		  <span className="input-group-addon">this.props.resName</span>
		  <span className="input-group-btn">
            <button className="btn btn-success btn-block" onclick={this.props.minus()}}>
                <span className="glyphicon glyphicon-minus"></span>
            </button>
    	  </span>
		  <input type="text" className="form-control" value="0" readonly />
		  <span className="input-group-btn">
            <button className="btn btn-success btn-block" onclick={this.props.plus()}>
                <span className="glyphicon glyphicon-plus"></span>
            </button>
    	  </span>
		</div>
  	);
  }
});

module.exports = ResourceItem;  