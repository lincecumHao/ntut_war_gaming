var React = require("react");
var SituationApp = require("./Situation/SituationApp.jsx");

//Chatroom 
var MessageList = require("./Chatroom/ChatMsgLst.jsx");
var MessageForm = require("./Chatroom/ChatForm.jsx");
var UserList = require("./Chatroom/UserList.jsx");

//TreeSet
var TreeMenu = require('react-tree-menu').TreeMenu;
var TreeMenuUtils = require('react-tree-menu').Utils;

//SysMsg
var SysMsgs = require("./SysMessage/SysMessages.jsx");

//ProgressBar
var ProgressBar = require("./Progressbar.jsx");

//MarkerWithLabel
var MarkerWithLabel = require('markerwithlabel');

//Resource
var Resource = require("./Resource/Resource.jsx");

var MapsUtil = require("./RefactorTest.js");

var socket = io();
var _mainMap;
var _eagleMap;
var _overlay;
var _eagleMapDefaultZoom = 10;


//remind what is next depart, for avoid geolocate out of query limit
var _nextDepart = 0;
var delay = 100;
var departsWithDuration = [];

var Top = React.createClass({

	getInitialState: function() {
		return {
			user: {name:""},
			users: ["all"],
			messages: [],
			sysMessages:[],
			text: '',
			chatTo: undefined,
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
			sendResource:[],
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
			res.departs = this._formateResource(res.departs);
			this.setState({
				user: res.user,
				departs: res.departs,
				treeData: this._formatDeparts(res.departs),
				sendResource: this._initResources(res.departs)
			});
			socket.emit('userLogin', this.state.user);
		}.bind(this));
	},

	componentDidMount: function() {
		setTimeout(this._after10Seconds, 10000);
		this._initMaps();
		socket.on("currentUsers", this._getCurrentUsers)
	  socket.on('send:message', this._messageRecieve);
	  socket.on('user:join', this._userJoined);
	  socket.on('user:left', this._userLeft);
	},

	_formateResource: function(departs){
    var formatedDepart = [];
    for(var i = 0; i < departs.length; i++){
        formatedDepart.push(this._doFromate(departs[i]));
    }
    return formatedDepart;
	},

	_doFromate: function(depart){
    var resources = depart.Resource;
    var formatedResource = []
    Object.keys(resources).forEach(function(key){
        var resource = {
            name: key,
            value: resources[key],
            send: 0
        };
        formatedResource.push(resource);
    });
    depart.Resource = [];
    depart.Resource = formatedResource;
    return depart;
	},

	_initResources:function(departs){
		var resList = [];
		for(var i = 0; i < departs[0].Resource.length; i++){
			var resource = departs[0].Resource[i];
			resource.value = 0;
			resList.push(resource);
		}
		return resList;
	},

	_getCurrentTotalSend: function(resource){
		var sendedResource = $.grep(this.state.sendResource, function(e){
			return e.name == resource.name;
		})[0];
		return sendedResource.value;
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
			checkbox : (depart.level > 0 ? true : false), 
			isRadio: true,
			id: depart._id,
			label: depart.name,
			children: []
		}
	},

	_initMaps: function(){
		MapsUtil.initMap();
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
		var selectedDepart = this.state.treeData;
		for(var level = 0; level < lineage.length; level++){
			var index = lineage[level];
			if(level + 1 == lineage.length){
				selectedDepart = selectedDepart[index];
			}else{
				selectedDepart = selectedDepart[index].children;
			}
		}
		selectedDepart = $.grep(this.state.departs, function(e){
			return e._id == selectedDepart.id;
		})[0];
		this.setState({
			selectDepart: selectedDepart
		});
		//temp1[index[0]].children[index[1]].children[index[2]]
		this.setState(TreeMenuUtils.getNewTreeState(lineage, this.state.treeData, propName));
	},

  _getCurrentUsers: function(data){
  	if(data){
        this.setState({
        users: this.state.users.concat(data) 
      });
    }
  },

  _messageRecieve: function(messageObj) {
  	  var stateMsgs = this.state.messages;
      stateMsgs.push(messageObj);
      this.setState({messages: stateMsgs});
  },

  _userJoined: function(username) {
      var currentUsers = this.state.users;
      if(currentUsers.indexOf(username) > -1) {
        return;
      }
      var currentSysMessages = this.state.sysMessages;
      currentSysMessages.push({text: username + " 已加入系統"});
      this.setState({
      	sysMessages: currentSysMessages
      });
  },

  _userLeft: function(username) {
      var currentSysMessages = this.state.sysMessages;
      currentSysMessages.push({text: username + " 已離開系統"});
      this.setState({
      	sysMessages: currentSysMessages
      });
  },

  _getRandomArbitrary: function(min, max) {
    return Math.random() * (max - min) + min;
	},

	_editSendCount: function(resName, value){
		console.log(value);
		//目前選到的depart
		var selectDepart = this.state.selectDepart;

		selectDepart.Resource.map((resource, id) => {
    	if(resource.name == resName){
    		resource.send = value;
    	}
    });

		//目前選到的 存在於陣列的哪一個index
		var modifyObjIndex = this._getDepartIndex(selectDepart, this.state.departs);
		var ary = this.state.departs;
		ary[modifyObjIndex] = selectDepart;
    this.setState({
    	departs: ary,
      selectDepart: selectDepart,
    });
    this._updateSendResource();
  },

  _updateSendResource: function(){
  	var sendRes = [];
  	for(var i = 0; i < this.state.departs.length; i++){
  		var depart = this.state.departs[i];
  		depart.Resource.map((resource, id) => {
  			
  			var res = $.grep(sendRes, function(e){
  				return e.name == resource.name;
  			})[0];
  			if(res == undefined){
  				res = {
  					name: resource.name,
  					value: resource.value
  				}
  			}else{
  				res.value = parseInt(res.value) + parseInt(resource.send);
  			}
  			sendRes.push(res);
  		});
  	}
  	this.setState({
  		sendResource: sendRes 
  	});
  },

  _getDepartIndex: function(selectedDepart, ary){
  	var index = $.map(ary, function(depart, index){
  		if(depart._id == selectedDepart._id){
  			return index;
  		}
  	});

  	return index[0];
  },

  onChatTo: function(username){
    this.setState({
      chatTo: (username == "all" ? undefined : username) 
    });
  },

  handleMessageSubmit: function(message) {
  	socket.emit('send:message', message);
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
				    		onTreeNodeCheckChange={this._handleDynamicTreeNodePropChange.bind(this, "checked")} 
				    		onTreeNodeCollapseChange={this._handleDynamicTreeNodePropChange.bind(this, "collapsed")}
				    		expandIconClass="fa fa-chevron-right"
	        			collapseIconClass="fa fa-chevron-down"
					    	data={this.state.treeData} 
				    	/>
				    </div>
				    <div id="wrapper" className="col-md-10">
				      <div id="map" className="map">map</div>
				      <div id="processBar" style={this.state.processBarStyle} className="over_map_processbar">
							  <ProgressBar completed={this.state.progressRate} color={"red"}/>
							</div>
				      <div id="over_map">{
				      	this.state.sysMessages.map((message, i) => {
                    return (
                        <SysMsgs
                            key={i}
                            text={message.text}
                        />
                    	);
               			})
                  }
                </div>
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
					        						currentTotalSend = {this._getCurrentTotalSend(resource)}
					        						departMaxResource = {resource.value}
					        						resourceName = {resource.name}
					        						send = {resource.send}
					        						edit = {this._editSendCount}
					        					/>
					        				);
					        			})
					        		}
				        		
				        	</div>
				        </div>
				        <div className="col-md-1">
				        </div>
				      </div>
				    </div>
				  </footer>
				</div>
				<div className="col-md-2 full-height chat">
					<UserList 
		                users={this.state.users}
		                onChatTo={this.onChatTo}
					/>
					<MessageList
						messages={this.state.messages}
	              	/>
					<MessageForm
						onMessageSubmit={this.handleMessageSubmit}
						chatTo={this.state.chatTo}
						from={this.state.user.name}
					/>
				</div>
			</div>
		);
	}
});

module.exports = Top;