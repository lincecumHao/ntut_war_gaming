var React = require('react');
var ResourceItem = require('./ResourceItem.jsx');
var ResourceUtils = require('./ResourceUtils.js');

var Resource = React.createClass({

	_editSendCount: function(resName, value){
		//目前選到的depart
		var selectDepart = this.props.selectDepart;
		selectDepart.Resource.forEach((resource, id) => {
			if(resource.name == resName){
				//更新deaprt 的 dispatched
				resource.dispatched = value;
			}
		});

		this._updateDeaprts(selectDepart);
	},

	_updateDeaprts: function(editedDepart){
		this.props.updateDeparts(editedDepart);
	},

	_resetRes: function(){
		var cancle = confirm("確定清除此分隊所有派送資源?")
		if(cancle){
			for(var i = 0; i < this.props.selectDepart.Resource.length; i++){
				this.refs['resItem' + i]._resetValue()
			}
		}
	},

	_sendRes: function(){
		var sendArray = [];
		for(var i = 0; i < this.props.selectDepart.Resource.length; i++){
			var resource = this.refs['resItem' + i]._getCurrentSend();
			if(resource.value > 0){
				sendArray.push(resource);
			}
		}
		if(sendArray.length > 0){
			var sendRes = confirm("確定派送目前資源?");
			if(sendRes){
				this.props.sendResource(sendArray);
			}
		}
	},

	render: function() {
		var displayBtn = {'display': 'none'};
		if(this.props.selectDepart.Resource.length){
			displayBtn = {};
		}
		return (
			<div className="row">
				<div className="col-md-1">
					<div className="row">
						<div className="footer-initial border-bottom">總派出資源</div>
						<div className="footer-initial border-bottom">各分隊資源</div>
					</div>
				</div>
				<div className='col-md-10 res-list'>
					{
						this.props.selectDepart.Resource.map((resource, i) => {
							return (
								<ResourceItem ref={'resItem' + i}
									key={i}
									totalDispatched = {ResourceUtils.getTotalDispatchedByResource(resource)}
									departMaxResource = {resource.maxAvailable}
									resourceName = {resource.name}
									dispatched = {resource.dispatched}
									edit = {this._editSendCount}
								/>
							);
						})
					}
				</div>
				<div className='col-md-1' style={displayBtn}>
					<button name="confirm" type="button" className='btn btn-primary send-res-confirm' onClick={this._sendRes}>送出</button>
					<bt/>
					<button name="cancle" type="button" className='btn btn-danger' onClick={this._resetRes}>取消</button>
				</div>
				
			</div>
		);
	}

});

module.exports = Resource;