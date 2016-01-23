var React = require("react");
var SituationApp = require("./Situation/SituationApp.jsx")
var TreeMenu = require('react-tree-menu').TreeMenu;
var TreeMenuUtils = require('react-tree-menu').Utils;
var socket = io();
var _mainMap;
var _eagleMap;
var _eagleMapDefaultZoom = 12;

var Top = React.createClass({

	getInitialState: function() {
		return {
			user: {},
			departs:[],
			treeData: [],
			situation: {
				step: "",
				description: ""
			},
			systemTime: ""
		};
	},

	componentWillMount: function() {
		this.setState({
			situation:{
				step: "災害發生初期階段",
				description: "臺北盆地因發生隱沒帶之強烈地震，震矩規模7.5，震央位置為中永和地區，本市各行政區震度皆為5級以上，包括本府各機關、重要交通設施、基礎設施、老舊建築物等均受災，由於通訊暫時中斷，一時之間，無法獲知詳細的災情。",
			},
			systemTime: this._getFormatedSystemTime()
		});

		//update system time per second.
		setInterval(function(){ 
			this.setState({
				systemTime: this._getFormatedSystemTime()
			}); 
		}.bind(this), 1000);

		//get user info
		$.get("/currentUser", function(res){
			this.setState({
				user: res.user,
				departs: res.departs
			});
			this.setState({
				treeData: this._formatDeparts(res.departs)
			});
			console.log(this.state.treeData);
		}.bind(this));
	},

	componentDidMount: function() {
		setTimeout(this._fakeChangeSituation, 10000);
		this._initMaps();
	},

	_formatDeparts: function(departs){
		var formatedAry = [];
		formatedAry.push(this._toTreeFormat(departs[0]));

		var maxLevel = this._getMaxDepartLevel(departs);
		for(var i = 1; i < departs.length; i++){
			formatedAry = this._add2Parent(departs[i], formatedAry);
		}
		return formatedAry;
	},

	_add2Parent: function(depart, array){
		for(var i = 0; i < array.length; i++){
			var parent = array[i];
			if(depart.parent == parent.label){
				array[i].children.push(this._toTreeFormat(depart));
				return array;
			}else if(parent.children.length > 0){
				this._add2Parent(depart, array[i].children);
			}
		}
		return array;
	},

	_getMaxDepartLevel: function(departs){
		var mxLevel = 0;
		for(var i = 0; i < departs.length; i++){
			mxLevel = (departs[i].level > mxLevel ? departs[i].level : mxLevel);
		}
		return mxLevel
	},

	_toTreeFormat: function(depart) {
		return{
			checkbox : (depart.level > 0 ? true : false), 
			label: depart.name,
			children: []
		}
	},

	_initMaps: function(){
		var mapOptions = {
			center: {
	            lat: 25.048644, 
	            lng: 121.533715
	        },
	        zoom: 15
		};
		_mainMap = new google.maps.Map(document.getElementById('map'), mapOptions);
		_mainMap.addListener("center_changed", function() {
			_eagleMap.setCenter(_mainMap.getCenter());    
		});

		_eagleMap = new google.maps.Map(document.getElementById('eagleMap'), mapOptions);
		_eagleMap.setZoom(_eagleMapDefaultZoom);
		_eagleMap.set("scrollwheel", false);
		_eagleMap.set("draggable", false)
	},

	_getFormatedSystemTime: function(){
		var date = new Date();
		return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	},
	
	_fakeChangeSituation: function(){
		this.setState({
			situation:{
				step: "災害應變階段",
				description: "現在溫刀火燒厝，請依指示進行處理"
			} 
		});
	},

	_handleDynamicTreeNodePropChange: function (propName, lineage) {

    this.setState(TreeMenuUtils.getNewTreeState(lineage, this.state.treeData, propName));

  },

	render: function() {
		return (
			<div className="row full-height">
				<div id="situation_wrapper" className="col-md-10 full-height">
				  <div id="situation" className="row">
				  	<SituationApp
									step={this.state.situation.step}
									description={this.state.situation.description}
									systemTime={this.state.systemTime}
								/>
				  </div>
				  <div className="row custom-content">
				    <div id="departList" className="col-md-2">
				    	<TreeMenu 
				    		onTreeNodeCollapseChange={this._handleDynamicTreeNodePropChange.bind(this, "collapsed")}
				    		expandIconClass="fa fa-chevron-right"
	        			collapseIconClass="fa fa-chevron-down"
					    	data={this.state.treeData} 
				    	/>
				    </div>
				    <div id="wrapper" className="col-md-10">
				      <div id="map" className="map">map</div>
				      <div id="over_map">overlay</div>
				    </div>
				  </div>
				  <footer className="footer">
				    <div className="container-fluid">
				      <div className="row">
				        <div id="eagleMap" className="col-md-2 eagle-map"></div>
				        <div className="col-md-9">123</div>
				        <div className="col-md-1">person</div>
				      </div>
				    </div>
				  </footer>
				</div>
				<div className="col-md-2 full-height chat">
				  <div className="row login-user"></div>
				  <div className="row message-list"></div>
				  <div className="row send-message">
				    <div className="input-group same-height">
				      <input type="text" className="form-control"/>
				      	<span className="input-group-btn">
				        	<button type="button" className="btn btn-success same-height">送出</button>
				        </span>
				    </div>
				  </div>
				</div>
			</div>
		);
	}
});

module.exports = Top;