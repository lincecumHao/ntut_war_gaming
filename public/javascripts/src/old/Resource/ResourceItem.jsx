var React = require('react');

var ResourceItem = React.createClass({
  hadleMinus: function(e){
    e.preventDefault();
    console.log("minus");
    this.props.edit(this.props.resName, -1);
  },

  handlePlus: function(e){
    e.preventDefault();
    this.props.edit(this.props.resName, 1);
  },

  render: function() {
  	return (
  		<div className="input-group">
  		  <span className="input-group-addon">{this.props.resName}</span>
		  <span className="input-group-btn">
        <button className="btn btn-success btn-block" onClick={this.hadleMinus}>
            <span className="glyphicon glyphicon-minus"></span>
        </button>
    	</span>
		  <input type="text" className="form-control resInput" value={this.props.resCount} readOnly />
		  <span className="input-group-btn">
        <button className="btn btn-success btn-block" onClick={this.handlePlus}>
            <span className="glyphicon glyphicon-plus"></span>
        </button>
  	  </span>
		</div>
  	);
  }
});

module.exports = ResourceItem;  