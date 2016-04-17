var React = require('react');

/**
 * require props:
 * resourceName 資源名稱 
 * totalDispatched 目前所有單位資源總數
 * departMaxResource 該單位最大資源數
 * edit, function() 增減數量的時候用的function
 * dispatched 目前派出數量
 **/

var Resource = React.createClass({

	getInitialState: function() {
		return {
			value: 0
		};
	},

	componentWillMount: function() {
		this.setState({
			value: this.props.send 
		});
	},

  _valueChange: function(e){
  	if(parseInt(e.target.value) > this.props.departMaxResource){
  		this.setState({
	  		value: this.props.departMaxResource
	  	});
  	}else{
  		this.setState({
	  		value: parseInt(e.target.value)
	  	});
  	}
  	this.props.edit(this.props.resourceName, e.target.value);
  },

  _resetValue: function(){
  	this.setState({
	  		value: 0
	  	});
  	this.props.edit(this.props.resourceName, 0);
  },

  //拿到目前選的資源數
  _getCurrentSend: function(){
  	return{
  		resName: this.props.resourceName,
  		value: this.state.value
  	}
  },

	render: function() {
		var iconPath = "";
		if(this.props.resourceName){
			iconPath = "/images/resourceIcons/" + this.props.resourceName + ".png"
		}
		return (
			<div className="col-md-1 res-item">
				<div className="row">
					<div className="footer-initial border-bottom">{this.props.totalDispatched}</div>
					<div className="footer-initial border-bottom">{this.props.departMaxResource}</div>
					<img src={iconPath} title={this.props.resourceName} alt={this.props.resourceName} width="32" height="32" />
					<br/>
	  			<input type="number" min="0" max={this.props.departMaxResource} value={this.props.dispatched} onChange={this._valueChange}/>
				</div>
			</div>
		);
	}

});

module.exports = Resource;