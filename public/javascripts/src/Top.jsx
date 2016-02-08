var React = require("react");
var SituationApp = require("./Situation/SituationApp.jsx");

//Chatroom 
var Chatroom = require("./Chatroom/").Chatroom;

//TreeSet
var TreeMenu = require('react-tree-menu').TreeMenu;
var TreeMenuUtils = require('react-tree-menu').Utils;

//SysMsg
var SystemMessage = require("./SysMessage/").SystemMessage;

//ProgressBar
var ProgressBar = require("./Progressbar.jsx");

//MarkerWithLabel
var MarkerWithLabel = require('markerwithlabel');

//Resource
var ResourceUtils = require("./Resource/").Utils;
var Resource = require("./Resource/").Resource;

var prevLineage = undefined;

var _mainMap;
var _eagleMap;
var _overlay;
var _eagleMapDefaultZoom = 10;

var delay = 100;
var departsWithDuration = [];

var Top = React.createClass({

	getInitialState: function() {
		return {
			user: {name:""},
			sysMessages:[],
			departs:[],
			treeData: [],
			situation: {
				step: "",
				description: ""
			},
			systemTime: "",
			progressRate: 100,
			disasterMarker: null,
			processBarStyle: {},
			selectDepart: {
				Resource: []
			}
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
				systemTime: this._getFormatedSystemTime(),
				progressRate: (this.state.progressRate == 0 ? 100 : this.state.progressRate - 10)
			}); 
		}.bind(this), 1000);

		//get user info
		$.get("/currentUser", function(res){
			var departs = ResourceUtils.initResource(res.departs);
			this.setState({
				user: res.user,
				departs: departs,
				treeData: this._formatDeparts(departs),
			});
		}.bind(this));
	},

	componentDidMount: function() {
		setTimeout(this._after10Seconds, 10000);
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
			//avoid parent name has duration time.
			var parentName = parent.label.split(" ")[0];
			if(depart.parent == parentName){
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
			depart: depart,
			checkbox : (depart.level > 0 ? true : false), 
			isRadio: true,
			id: depart._id,
			label: depart.name,
			children: []
		}
	},

	_initMaps: function(){
		var minZoomLevel = 13;
		var mapOptions = {
			center: {
	lat: 25.048644, 
	lng: 121.533715
	},
	zoom: minZoomLevel
		};

_mainMap = new google.maps.Map(document.getElementById('map'), mapOptions);
console.log(_mainMap);

//only for call fromLatLngToContainerPixel, ugly indeed
_overlay = new google.maps.OverlayView();
_overlay.draw = function() {};
_overlay.setMap(_mainMap);

var eagleRectangle = new google.maps.Rectangle({
	strokeColor: '#FF0000',
	strokeOpacity: 1,
	strokeWeight: 2,
	bounds: _mainMap.getBounds()
	});

_mainMap.addListener("center_changed", function(e) {
			//_eagleMap.setCenter(_mainMap.getCenter()); 
			this._checkBounds();
			if(this.state.disasterMarker != null){
				var point2 = _overlay.getProjection().fromLatLngToContainerPixel(this.state.disasterMarker.getPosition());
				var info = document.getElementById("processBar");
				this.setState({
					processBarStyle:{
						left: (point2.x - 50) + "px",
						top: (point2.y - 70) + "px",
						display: "block"
					} 
				});
			}
			eagleRectangle.setBounds(_mainMap.getBounds());
		}.bind(this));

// Limit the zoom level
		_mainMap.addListener("zoom_changed", function(e){
			if (_mainMap.getZoom() < minZoomLevel) _mainMap.setZoom(minZoomLevel);
		});

		_eagleMap = new google.maps.Map(document.getElementById('eagleMap'), mapOptions);
		_eagleMap.setZoom(_eagleMapDefaultZoom);
		_eagleMap.set("scrollwheel", false);
		_eagleMap.set("draggable", false);
		eagleRectangle.setMap(_eagleMap);

	},

	_checkBounds: function(){
		var allowedBounds = new google.maps.LatLngBounds(new google.maps.LatLng(25.019051, 121.495545), new google.maps.LatLng(25.078147, 121.624291));
		if(! allowedBounds.contains(_mainMap.getCenter())) {
			var C = _mainMap.getCenter();
			var X = C.lng();
			var Y = C.lat();

			var AmaxX = allowedBounds.getNorthEast().lng();
			var AmaxY = allowedBounds.getNorthEast().lat();
			var AminX = allowedBounds.getSouthWest().lng();
			var AminY = allowedBounds.getSouthWest().lat();

			if (X < AminX) {X = AminX;}
			if (X > AmaxX) {X = AmaxX;}
			if (Y < AminY) {Y = AminY;}
			if (Y > AmaxY) {Y = AmaxY;}

			_mainMap.setCenter(new google.maps.LatLng(Y,X));
		}
	},

	_getFormatedSystemTime: function(){
		var date = new Date();
		return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	},
	
	_after10Seconds: function(){
		//create a random disaster marker and set gif icon.
		var randomLat = this._getRandomArbitrary(25.025246, 25.068014);
		var randomLng = this._getRandomArbitrary(121.509532, 121.564464);
		var randomCoordinate = new google.maps.LatLng(randomLat, randomLng);
		var marker = new google.maps.Marker({
			map: _mainMap,
			draggable: false,
			position: randomCoordinate,
			optimized:false,
		 	icon: {
		 		url: "./images/Fire_gif_50.gif",
		 		size: new google.maps.Size(50, 50)
		 	}
		});

		//change situation
		this.setState({
			situation:{
				step: "災害應變階段",
				description: "現在溫刀火燒厝，請依指示進行處理"
			},
			disasterMarker: marker 
		});

_mainMap.panTo(marker.position);
_mainMap.setZoom(18);

//add a spin and a label on _eagleMap
var spin = new MarkerWithLabel({
	position: randomCoordinate,
	icon: {
	path: google.maps.SymbolPath.CIRCLE,
	scale: 0, //tamaño 0
	},
	map: _eagleMap,
	draggable: false,
	labelAnchor: new google.maps.Point(25, 25),
	labelClass: "spinner",
	});
	
	var label = new MarkerWithLabel({
	position: randomCoordinate,
	icon: {
	path: google.maps.SymbolPath.CIRCLE,
	strokeColor: 'red',
	fillColor : 'red',
	fillOpacity: 1,
	scale: 3, //tamaño 0
	},
	map: _eagleMap,
	draggable: false,
	});
	google.maps.event.trigger(_mainMap, "center_changed");
this._onDisasterHappen();
	},

	_onDisasterHappen: function(){
		this._getDurationTime(0, 100);
	},

	_getDurationTime: function(current, delay){
		var depart = this.state.departs[current];
		var directionsService = new google.maps.DirectionsService;
		directionsService.route({
			origin: depart.address,
			destination: this.state.disasterMarker.getPosition(),
			optimizeWaypoints: true,
			travelMode: google.maps.TravelMode.DRIVING
	}, function(response, status) {
		if(status == google.maps.GeocoderStatus.OK){
			var duration = response.routes[0].legs[0].duration.text;
			depart.name = depart.name + " (" + duration + ")";
			departsWithDuration.push(depart);
			current++
			if(current < this.state.departs.length){
					this._getDurationTime(current, 100);
				}else if(current == this.state.departs.length){
					this.setState({
					departs: departsWithDuration,
					treeData: this._formatDeparts(departsWithDuration)
				});
				}
		}else{
			if(status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
				setTimeout(function(){this._getDurationTime(current)}.bind(this), delay++);
			}else{
				departsWithDuration.push(depart);
			}
		}
		// next();
	}.bind(this));
	},

	_handleDynamicTreeNodePropChange: function (propName, lineage) {

		this.setState({
			selectDepart: this._getSelectDepart(this.state.treeData, lineage.slice())
		});
		
		//uncheck the previous depart
		if(prevLineage){
			this.setState(TreeMenuUtils.getNewTreeState(prevLineage, this.state.treeData, propName));	
		}
		
		prevLineage = lineage.slice();
		this.setState(TreeMenuUtils.getNewTreeState(lineage, this.state.treeData, propName));
	},

	/**
	 *	get selected tree node, and return depart attribute
	 *	取得選到的treeNode, 並回傳 depart attribute
	 *	@param treeData
	 *	@param lineage
	 *	@return depart obj
	 **/
	_getSelectDepart: function(treeData, lineage){
		var id = lineage.shift();
		var select;
		treeData.forEach(function (node, nodeId) {
			if (nodeId === id) {
	          if (!lineage.length) {
	          	select = node.depart;
	          } else {
	          	select = this._getSelectDepart(treeData[nodeId].children, lineage);
	          }
	        }
	    }.bind(this));
	    return select;
	},

	/**
	 *	update system notify message
	 *	新增系統提醒文字
	 **/
	_systemNotify: function(message){
		var currentSysMessages = this.state.sysMessages;
		currentSysMessages.push({text: message});
		this.setState({
			sysMessages: currentSysMessages
		});
	},

	_getRandomArbitrary: function(min, max) {
		return Math.random() * (max - min) + min;
	},

	_editSendCount: function(resName, value){
		//目前選到的depart
		var selectDepart = this.state.selectDepart;
		selectDepart.Resource.forEach((resource, id) => {
			if(resource.name == resName){
				//更新deaprt 的 dispatched
				resource.dispatched = value;
			}
		});
	
		//目前選到的 存在於陣列的哪一個index
		var modifyObjIndex = this._getDepartIndex(selectDepart, this.state.departs);
		var ary = this.state.departs;
		ary[modifyObjIndex] = selectDepart;
		//更新 depart 陣列 跟 slelectDepart 
		this.setState({
			departs: ary,
			selectDepart: selectDepart,
		});

		//更新總派出資源
		ResourceUtils.updateTotalDispatchedByDeparts(this.state.departs);
	},

	/**
	 *	get index of the selected depart in the departs array.
	 *	取得depart 在 陣列中的 index
	 **/
	_getDepartIndex: function(selectedDepart, ary){
		var index = $.map(ary, function(depart, index){
			if(depart._id == selectedDepart._id){
				return index;
			}
		});
		return index[0];
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
							<div>
								<input type="button" className="btn-success" value="確認派送" />
							</div>
							<TreeMenu
								onTreeNodeCheckChange={this._handleDynamicTreeNodePropChange.bind(this, "checked")} 
								onTreeNodeCollapseChange={this._handleDynamicTreeNodePropChange.bind(this, "collapsed")}
								expandIconClass="fa fa-chevron-right"
								collapseIconClass="fa fa-chevron-down"
								data={this.state.treeData} 
							/>
						</div>
					
						<div id="wrapper" className="col-md-10">
							<div id="map" className="map">
								map
							</div>
							<div id="processBar" style={this.state.processBarStyle} className="over_map_processbar">
								<ProgressBar 
									completed={this.state.progressRate} 
									color={"red"}
								/>
							</div>
							<SystemMessage sysMessages={this.state.sysMessages}	/>
						</div>
					</div>
					<footer className="footer">
						<div className="container-fluid">
							<div className="row">
								<div id="eagleMap" className="col-md-2 eagle-map"></div>
								<div className="col-md-9">
									<div className="row">
										<div className="col-md-1">
											<div className="row">
												<div className="footer-initial border-bottom">預計派出資源</div>
												<div className="footer-initial border-bottom">各分隊資源</div>
											</div>
										</div>
										{
											this.state.selectDepart.Resource.map((resource, i) => {
												return (
													<Resource 
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
								</div>
								<div className="col-md-1"></div>
							</div>
						</div>
					</footer>
				</div>
				<Chatroom 
					self={this.state.user}
					systemNotify={this._systemNotify}
				/>
			</div>
		);
	}
});

module.exports = Top;
